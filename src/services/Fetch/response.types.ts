// Common Types
type CharactersUrlType = "detail" | "wiki" | "comiclink";
type ComicsUrlType = "detail" | "purchase";
type UrlType = CharactersUrlType | ComicsUrlType;

interface IUrlItem<T extends UrlType> {
	type: T,
	url: string;
}

interface IThumbnail {
	path: string;
	extension: string;
}

interface ISuccessfulResponse<T> {
	code: 200;
	status: "Ok";
	data: {
		offset: number;
		total: number;
		results: T[];
	};
}

interface IFailedResponse {
	code: string | number,
	message?: string;
	status?: string;
}


// Characters Types
interface IComicBase {
	resourceURI: string,
	name: string;
}

interface INativeCharacter {
	id: number;
	name: string;
	description: string | null;
	thumbnail: IThumbnail,
	comics: {
		items: IComicBase[];
	},
	urls: IUrlItem<CharactersUrlType>[];
}


// Comics Types
interface IComicTextObject {
	type: string;
	language: string;
	text: string;
}

interface IComicPrice {
	type: string,
	price: number;
}

interface INativeComic {
	id: number;
	title: string;
	description: string | null;
	pageCount: number;
	textObjects: IComicTextObject[];
	urls: IUrlItem<ComicsUrlType>[];
	prices: IComicPrice[];
	thumbnail: IThumbnail;
}




export {
	INativeCharacter,
	INativeComic,
	ISuccessfulResponse,
	IFailedResponse,
	IUrlItem,
	UrlType,
	IThumbnail
};