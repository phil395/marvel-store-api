import { DEFAULT_SETTINGS } from "../config";
import FetchData from "../services/Fetch/FetchData";
import Builder from "./Builder";
import { isSuccessfulResponse } from "../services/type-guards";

import type { IFailedResponse, INativeCharacter, INativeComic } from '../services/Fetch/response.types';
import type { IComic, ICharacter, IFailedYield, ISuccessYield, IPersistentState } from "../models.types";

const { LIMIT, INITIAL_OFFSET } = DEFAULT_SETTINGS;

abstract class Endpoint<T extends INativeCharacter | INativeComic, K extends ICharacter | IComic> {

	protected abstract api: FetchData<T>;

	protected abstract builder: Builder<T, K>;

	protected settings = {
		limit: LIMIT,
		currentOffset: INITIAL_OFFSET,
		total: 1500  // will be update after first request
	};

	protected rest: K[] = [];

	protected yieldLog: K[] = [];

	async get(qty: number): Promise<ISuccessYield<K> | IFailedYield> {
		if (this.rest.length > qty) return this.buildSuccessYield(qty);

		const answer = await this.fillRest();
		if (answer.ok === false) return answer;  // as IFailedYield

		return await this.get(qty);
	}

	protected async fillRest(): Promise<{ ok: true; } | IFailedYield> {
		try {
			const { currentOffset, total } = this.settings;
			if (currentOffset > total) return this.buildFailedYield('data limit reached');
			const answer = await this.api.fetchSet(currentOffset);

			if (isSuccessfulResponse(answer)) {

				this.updateOffset();
				this.updateTotalQty(answer.data.total);

				const result = this.builder
					.set(answer.data.results)
					.filterEmptyImg()
					// .filterEmptyDescription()		// Uncoment if it's need
					// .filterEmptyWiki()
					.build();

				this.rest = [...this.rest, ...result];
				return { ok: true };
			}

			return this.buildFailedYield(answer);

		} catch (e) {
			if (e instanceof Error) return this.buildFailedYield(e.message);
			return this.buildFailedYield(`Unknown error in ${this.api.path} fetch`);
		}
	}

	protected updateTotalQty(total: number): void {
		this.settings.total = total;
	}

	protected updateOffset(): void {
		const { limit, currentOffset } = this.settings;
		this.settings.currentOffset = currentOffset + limit;
	}

	protected log(yieldSet: K[]): void {
		this.yieldLog = [...this.yieldLog, ...yieldSet];
	}

	protected separateYield(qty: number): K[] {
		const yieldSet = this.rest.slice(0, qty);
		this.rest = this.rest.slice(qty);
		return yieldSet;
	}

	protected buildSuccessYield(qty: number): ISuccessYield<K> {
		const yieldSet = this.separateYield(qty);
		this.log(yieldSet)
		return { ok: true, payload: yieldSet };
	}

	getState(): IPersistentState<K> {
		return {
			offset: this.settings.currentOffset,
			data: [...this.yieldLog, ...this.rest]
		};
	}

	setState(state: IPersistentState<K>) {
		this.rest = state.data;
		this.settings.currentOffset = state.offset;
	}

	protected buildFailedYield(msg: string): IFailedYield;
	protected buildFailedYield(response: IFailedResponse): IFailedYield;
	protected buildFailedYield(payload: string | IFailedResponse): IFailedYield {
		if (typeof payload === 'string') return { ok: false, msg: payload };

		const { code, message, status } = payload;
		return {
			ok: false,
			msg: `Bad Response. Code: ${code}. Message: ${message}. Status: ${status}`
		};
	}
}

export default Endpoint;