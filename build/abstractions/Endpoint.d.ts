import FetchData from "../services/Fetch/FetchData";
import Builder from "./Builder";
import type { IFailedResponse, INativeCharacter, INativeComic } from '../services/Fetch/response.types';
import type { IComic, ICharacter, IFailedYield, ISuccessYield, IPersistentState } from "../models.types";
declare abstract class Endpoint<T extends INativeCharacter | INativeComic, K extends ICharacter | IComic> {
    protected abstract api: FetchData<T>;
    protected abstract builder: Builder<T, K>;
    protected settings: {
        limit: number;
        currentOffset: number;
        total: number;
    };
    protected rest: K[];
    protected yieldLog: K[];
    get(qty: number): Promise<ISuccessYield<K> | IFailedYield>;
    protected fillRest(): Promise<{
        ok: true;
    } | IFailedYield>;
    protected updateTotalQty(total: number): void;
    protected updateOffset(): void;
    protected log(yieldSet: K[]): void;
    protected separateYield(qty: number): K[];
    protected buildSuccessYield(qty: number): ISuccessYield<K>;
    getState(): IPersistentState<K>;
    setState(state: IPersistentState<K>): void;
    protected buildFailedYield(msg: string): IFailedYield;
    protected buildFailedYield(response: IFailedResponse): IFailedYield;
}
export default Endpoint;
