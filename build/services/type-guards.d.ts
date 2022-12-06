import type { IFailedResponse, INativeCharacter, INativeComic, ISuccessfulResponse } from "./Fetch/response.types";
declare const isSuccessfulResponse: (answer: ISuccessfulResponse<any> | IFailedResponse) => answer is ISuccessfulResponse<any>;
declare const isNativeCharacter: (item: INativeCharacter | INativeComic) => item is INativeCharacter;
export { isSuccessfulResponse, isNativeCharacter };
