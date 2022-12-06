import type { IFailedResponse, INativeCharacter, INativeComic, ISuccessfulResponse } from "./response.types";
declare class FetchData<T extends INativeCharacter | INativeComic> {
    path: T extends INativeCharacter ? 'characters' : 'comics';
    private limit;
    constructor(path: T extends INativeCharacter ? 'characters' : 'comics', limit: number);
    private fetch;
    fetchSet(offset: number): Promise<ISuccessfulResponse<T> | IFailedResponse>;
    fetchWithCustomParams(params: Record<string, string | number>): Promise<ISuccessfulResponse<T> | IFailedResponse>;
}
export default FetchData;
