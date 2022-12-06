import Builder, { IBuilderRules } from "./abstractions/Builder";
import Endpoint from "./abstractions/Endpoint";
import FetchData from "./services/Fetch/FetchData";
import { concateImgPath, findUrl } from "./services/utils";

import type { INativeComic } from "./services/Fetch/response.types";
import type { IComic, IPersistentState, ISuccessYield } from "./models.types";

interface IAdditionalBuilderRules {
	priceIsRequired: boolean,
	qtyPageIsRequired: boolean,
	withoutDuplicates: boolean;
}

interface IPersistentExtraComicsState extends IPersistentState<IComic> {
	idsLog: number[];
}

class Comics extends Endpoint<INativeComic, IComic> {
	protected api = new FetchData<INativeComic>('comics', this.settings.limit);
	protected builder = new ComicsBuilder();

	getFromHistoryById(id: number) {
		if (this.builder.idsLog.has(id)) {
			const fromRest = this.rest.find(comic => comic.id === id);
			const fromYieldLog = this.yieldLog.find(comic => comic.id === id);
			const result = fromRest || fromYieldLog;
			if (result) return { ok: true, payload: [result] } as ISuccessYield<IComic>;
		}
		return this.buildFailedYield('Comic not found in local history');
	}

	protected override log(yieldSet: IComic[]): void {
		super.log(yieldSet);

		// unique ids logging
		yieldSet.forEach(comic => this.builder.idsLog.add(comic.id));
		this.rest.forEach(comic => this.builder.idsLog.add(comic.id));
	}

	override getState(): IPersistentExtraComicsState {
		return {
			...super.getState(),
			idsLog: [...this.builder.idsLog]
		};
	}

	override setState(state: IPersistentExtraComicsState): void {
		super.setState(state);
		this.builder.idsLog = new Set(state.idsLog);
	}
}

class ComicsBuilder extends Builder<INativeComic, IComic> {

	idsLog = new Set<number>();

	protected override rules: IBuilderRules & IAdditionalBuilderRules = {
		...this.rules,
		priceIsRequired: false,
		qtyPageIsRequired: false,
		withoutDuplicates: false
	};

	filterEmptyPrice(): this {
		this.rules.priceIsRequired = true;
		return this;
	}

	filterEmptyPageQty(): this {
		this.rules.qtyPageIsRequired = true;
		return this;
	}

	filterDuplicates(): this {
		this.rules.withoutDuplicates = true;
		return this;
	}

	protected override applyRules(): INativeComic[] {
		const {
			priceIsRequired: price,
			qtyPageIsRequired: pageQty,
			withoutDuplicates: unique } = this.rules;

		if (!price && !pageQty && !unique) return super.applyRules();

		return super.applyRules().filter(comic => {
			const isEmptyPrice = price && comic.prices[0].price === 0;
			if (isEmptyPrice) return false;

			const isEmptyPageQty = pageQty && comic.pageCount === 0;
			if (isEmptyPageQty) return false;

			const isNotUniqueComic = unique && this.idsLog.has(comic.id);
			if (isNotUniqueComic) return false;

			return true;
		});
	}

	build(): IComic[] {
		return this
			.filterEmptyPrice()
			.filterEmptyPageQty()
			.filterDuplicates()
			.applyRules()
			.map(comic => ({
				id: comic.id,
				description: comic.description ?? '',
				thumbnail: concateImgPath(comic.thumbnail),
				prices: comic.prices[0].price,
				pageCount: comic.pageCount,
				language: comic.textObjects.length ? comic.textObjects[0].language : undefined,
				title: comic.title,
				url: findUrl("detail", comic.urls),
			}));
	}
}

export default Comics;


