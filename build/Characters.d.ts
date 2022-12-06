import Endpoint from './abstractions/Endpoint';
import FetchData from './services/Fetch/FetchData';
import Builder from './abstractions/Builder';
import Randomizer from './services/Randomizer';
import type { INativeCharacter } from './services/Fetch/response.types';
import type { ICharacter, IFailedYield, ISuccessYield } from './models.types';
declare class Characters extends Endpoint<INativeCharacter, ICharacter> {
    protected api: FetchData<INativeCharacter>;
    protected builder: CharactersBuilder;
    protected randomizer: Randomizer;
    getByName(name: string): Promise<ISuccessYield<ICharacter> | IFailedYield>;
    getRandomCharacter(): Promise<ISuccessYield<ICharacter> | IFailedYield>;
}
declare class CharactersBuilder extends Builder<INativeCharacter, ICharacter> {
    build(): ICharacter[];
}
export default Characters;
