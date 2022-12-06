
// 'ISuccessYield' or 'IFailedYield' - the result of the application work in all cases

interface ISuccessYield<T extends ICharacter | IComic> {
	ok: true;
	payload: T[];
}

interface IFailedYield {
	ok: false;
	msg: string;
}


interface ICharacter {
	id: number;
	name: string;
	description: string;
	thumbnail: string;
	comics: IComicBase[];
	wiki: string | null;
}


interface IComicBase {
	title: string;
	url: string | null;
}

interface IComic extends IComicBase {
	id: number;
	description: string;
	thumbnail: string;
	prices: number;
	pageCount: number;
	language?: string;
}


// utility type for 'PersistenceMarvelApi' functioning

interface IPersistentState<T extends ICharacter | IComic> {
	offset: number;
	data: T[];
}


export {
	ICharacter,
	IComicBase,
	IComic,
	ISuccessYield,
	IFailedYield,
	IPersistentState
};

