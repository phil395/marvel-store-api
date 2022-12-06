import type { IFailedResponse, INativeCharacter, INativeComic, ISuccessfulResponse } from "./Fetch/response.types";

const isSuccessfulResponse = (answer: ISuccessfulResponse<any> | IFailedResponse): answer is ISuccessfulResponse<any> => {
	if (answer.code === 200) return true;
	return false;
};

const isNativeCharacter = (item: INativeCharacter | INativeComic): item is INativeCharacter => {
	if ('pageCount' in item) return false;
	return true;
};


export {
	isSuccessfulResponse,
	isNativeCharacter
};