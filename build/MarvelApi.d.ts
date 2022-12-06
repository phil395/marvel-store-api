import Characters from "./Characters";
import Comics from "./Comics";
declare class MarvelApi {
    characters: Characters;
    comics: Comics;
    private static instance;
    constructor();
}
declare class PersistenceMarvelApi extends MarvelApi {
    saveState(endpoint: 'characters' | 'comics'): void;
    restoreState(): void;
}
declare const _default: PersistenceMarvelApi;
export default _default;
