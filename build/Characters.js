import Endpoint from './abstractions/Endpoint';
import FetchData from './services/Fetch/FetchData';
import Builder from './abstractions/Builder';
import Randomizer from './services/Randomizer';
import { concateImgPath, findUrl } from './services/utils';
import { isSuccessfulResponse } from './services/type-guards';
import { CHARACTERS_SETTINGS } from './config';
const { SEARCH_PARAM_FOR_NAME, MIN_SET_SIZE_FOR_RANDOM } = CHARACTERS_SETTINGS;
class Characters extends Endpoint {
    api = new FetchData('characters', this.settings.limit);
    builder = new CharactersBuilder();
    randomizer = new Randomizer();
    async getByName(name) {
        try {
            const answer = await this.api.fetchWithCustomParams({ [SEARCH_PARAM_FOR_NAME]: name });
            if (isSuccessfulResponse(answer)) {
                const result = this.builder
                    .set(answer.data.results)
                    .filterEmptyImg()
                    .build();
                return (result.length > 0)
                    ? { ok: true, payload: result }
                    : this.buildFailedYield('Character not found');
            }
            return this.buildFailedYield(answer);
        }
        catch (e) {
            if (e instanceof Error)
                return this.buildFailedYield(e.message);
            return this.buildFailedYield(`Unknown error in ${this.api.path} fetch`);
        }
    }
    async getRandomCharacter() {
        this.randomizer.setItems([...this.yieldLog, ...this.rest]);
        if (this.randomizer.isOk(MIN_SET_SIZE_FOR_RANDOM)) {
            const randomChar = this.randomizer.run();
            return { ok: true, payload: [randomChar] };
        }
        const answer = await this.fillRest();
        if (answer.ok === false)
            return answer;
        return await this.getRandomCharacter();
    }
}
class CharactersBuilder extends Builder {
    build() {
        const { maxComicsQty: comicsQty } = this.rules;
        return this
            .applyRules()
            .map(char => ({
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
