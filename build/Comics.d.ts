import Builder, { IBuilderRules } from "./abstractions/Builder";
import Endpoint from "./abstractions/Endpoint";
import FetchData from "./services/Fetch/FetchData";
import type { INativeComic } from "./services/Fetch/response.types";
import type { IComic, IPersistentState, ISuccessYield } from "./models.types";
interface IAdditionalBuilderRules {
    priceIsRequired: boolean;
    qtyPageIsRequired: boolean;
    withoutDuplicates: boolean;
}
interface IPersistentExtraComicsState extends IPersistentState<IComic> {
    idsLog: number[];
}
declare class Comics extends Endpoint<INativeComic, IComic> {
    protected api: FetchData<INativeComic>;
    protected builder: ComicsBuilder;
    getFromHistoryById(id: number): import("./models.types").IFailedYield | ISuccessYield<IComic>;
    protected log(yieldSet: IComic[]): void;
    getState(): IPersistentExtraComicsState;
    setState(state: IPersistentExtraComicsState): void;
}
declare class ComicsBuilder extends Builder<INativeComic, IComic> {
    idsLog: Set<number>;
    protected rules: IBuilderRules & IAdditionalBuilderRules;
    filterEmptyPrice(): this;
    filterEmptyPageQty(): this;
    filterDuplicates(): this;
    protected applyRules(): INativeComic[];
    build(): IComic[];
}
export default Comics;
