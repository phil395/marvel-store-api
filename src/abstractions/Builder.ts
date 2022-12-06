import { DEFAULT_SETTINGS, CHARACTERS_SETTINGS } from "../config";
import { isNativeCharacter } from "../services/type-guards";
import { findUrl } from "../services/utils";

import type { INativeCharacter, INativeComic } from "../services/Fetch/response.types";
import type { ICharacter, IComic } from "../models.types";

const { MIN_DESCR_LENGTH, IMG_PATH_BLACKLIST } = DEFAULT_SETTINGS;
const { MAX_COMICS_QTY } = CHARACTERS_SETTINGS;

interface IBuilderRules {
	imgIsRequired: boolean,
	descriptionIsRequired: boolean,
	wikiIsRequired: boolean,
	maxComicsQty: number,
	minDescrLength: number;
}

abstract class Builder<T extends INativeCharacter | INativeComic, K extends ICharacter | IComic> {

	abstract build(): K[];

	protected input: T[] = [];

	protected rules: IBuilderRules = {
		imgIsRequired: false,
		descriptionIsRequired: false,
		wikiIsRequired: false,
		maxComicsQty: MAX_COMICS_QTY,
		minDescrLength: MIN_DESCR_LENGTH
	};

	set(input: T[]): this {
		this.input = input;
		return this;
	}

	filterEmptyImg(): this {
		this.rules.imgIsRequired = true;
		return this;
	}

	filterEmptyDescription(): this {
		this.rules.descriptionIsRequired = true;
		return this;
	}

	filterEmptyWiki(): this {
		this.rules.wikiIsRequired = true;
		return this;
	}

	protected applyRules(): T[] {
		const {
			imgIsRequired: img,
			descriptionIsRequired: descr,
			wikiIsRequired: wiki,
			minDescrLength: length } = this.rules;

		return this.input.filter(charOrComic => {
			const isBadImg = img && IMG_PATH_BLACKLIST.includes(charOrComic.thumbnail.path);
			if (isBadImg) return false;

			const isBadDescr = descr && (charOrComic.description === null || charOrComic.description.trim().length < length);
			if (isBadDescr) return false;

			let wikiUrl: string | null;
			if (isNativeCharacter(charOrComic)) {
				wikiUrl = findUrl('wiki', charOrComic.urls);
			} else {
				wikiUrl = findUrl('detail', charOrComic.urls);
			}
			const isBadWiki = wiki && !wikiUrl;
			if (isBadWiki) return false;

			return true;
		});
	}

}

export default Builder;

export { IBuilderRules };