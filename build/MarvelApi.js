import Characters from "./Characters";
import Comics from "./Comics";
class MarvelApi {
    characters = new Characters();
    comics = new Comics();
    static instance;
    constructor() {
        if (MarvelApi.instance)
            return MarvelApi.instance;
        MarvelApi.instance = this;
    }
}
class PersistenceMarvelApi extends MarvelApi {
    saveState(endpoint) {
        if (!window)
            return;
        if (endpoint !== 'characters' && endpoint !== 'comics')
            return;
        const state = this[endpoint].getState();
        window.localStorage.setItem(endpoint, JSON.stringify(state));
    }
    restoreState() {
        if (!window)
            return;
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
