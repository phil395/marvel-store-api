import Endpoint from './abstractions/Endpoint';
import FetchData from './services/Fetch/FetchData';
import Builder from './abstractions/Builder';
import Randomizer from './services/Randomizer';
import { concateImgPath, findUrl } from './services/utils';
import { isSuccessfulResponse } from './services/type-guards';
import { CHARACTERS_SETTINGS } from './config';

import type { INativeCharacter } from './services/Fetch/response.types';
import type { ICharacter, IFailedYield, ISuccessYield } from './models.types';

const { SEARCH_PARAM_FOR_NAME, MIN_SET_SIZE_FOR_RANDOM } = CHARACTERS_SETTINGS;

class Characters extends Endpoint<INativeCharacter, ICharacter> {
	protected api = new FetchData<INativeCharacter>('characters', this.settings.limit);
	protected builder = new CharactersBuilder();
	protected randomizer = new Randomizer();

	async getByName(name: string): Promise<ISuccessYield<ICharacter> | IFailedYield> {
		try {

			const answer = await this.api.fetchWithCustomParams({ [SEARCH_PARAM_FOR_NAME]: name });

			if (isSuccessfulResponse(answer)) {

				const result = this.builder
					.set(answer.data.results)
					.filterEmptyImg()
					// .filterEmptyDescription()		// Uncoment if it's need
					// .filterEmptyWiki()
					.build();

				return (result.length > 0)
					? { ok: true, payload: result } as ISuccessYield<ICharacter>
					: this.buildFailedYield('Character not found');
			}

			return this.buildFailedYield(answer);

		} catch (e) {
			if (e instanceof Error) return this.buildFailedYield(e.message);
			return this.buildFailedYield(`Unknown error in ${this.api.path} fetch`);
		}
	}

	async getRandomCharacter(): Promise<ISuccessYield<ICharacter> | IFailedYield> {

		this.randomizer.setItems([...this.yieldLog, ...this.rest]);

		if (this.randomizer.isOk(MIN_SET_SIZE_FOR_RANDOM)) {
			const randomChar = this.randomizer.run();
			return { ok: true, payload: [randomChar] } as ISuccessYield<ICharacter>;
		}

		const answer = await this.fillRest();
		if (answer.ok === false) return answer;  // as IFailedYield

		return await this.getRandomCharacter();
	}
}


class CharactersBuilder extends Builder<INativeCharacter, ICharacter> {
	build(): ICharacter[] {
		const { maxComicsQty: comicsQty } = this.rules;
		return this
			.applyRules()
			.map<ICharacter>(char => ({
				id: char.id,
				name: char.name,
				description: char.description ?? '',
				comics: char.comics.items.slice(0, comicsQty).map(comic => ({
					title: comic.name,
					url: comic.resourceURI
				})),
				thumbnail: concateImgPath(char.thumbnail),
				wiki: findUrl('wiki', char.urls)
			}));
	}
}


export default Characters;

