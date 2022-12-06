import type { INativeCharacter, INativeComic } from "../services/Fetch/response.types";
import type { ICharacter, IComic } from "../models.types";
interface IBuilderRules {
    imgIsRequired: boolean;
    descriptionIsRequired: boolean;
    wikiIsRequired: boolean;
    maxComicsQty: number;
    minDescrLength: number;
}
declare abstract class Builder<T extends INativeCharacter | INativeComic, K extends ICharacter | IComic> {
    abstract build(): K[];
    protected input: T[];
    protected rules: IBuilderRules;
    set(input: T[]): this;
    filterEmptyImg(): this;
    filterEmptyDescription(): this;
    filterEmptyWiki(): this;
    protected applyRules(): T[];
}
export default Builder;
export { IBuilderRules };
