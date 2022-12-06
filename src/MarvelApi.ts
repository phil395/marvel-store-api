import Characters from "./Characters";
import Comics from "./Comics";


class MarvelApi {
	public characters = new Characters();
	public comics = new Comics();

	private static instance: MarvelApi;

	constructor() {
		if (MarvelApi.instance) return MarvelApi.instance;

		MarvelApi.instance = this;
	}
}


class PersistenceMarvelApi extends MarvelApi {

	saveState(endpoint: 'characters' | 'comics'): void {
		if (!window) return;
		if (endpoint !== 'characters' && endpoint !== 'comics') return;

		const state = this[endpoint].getState();
		window.localStorage.setItem(endpoint, JSON.stringify(state));
	}

	restoreState(): void {
		if (!window) return;
		const charactersSerializedState = window.localStorage.getItem('characters');
		const comicsSerializedState = window.localStorage.getItem('comics');

		if (charactersSerializedState) {
			this.characters.setState(JSON.parse(charactersSerializedState));
		}

		if (comicsSerializedState) {
			this.comics.setState(JSON.parse(comicsSerializedState));
		}
	}
}


export default new PersistenceMarvelApi();