import { IThumbnail, IUrlItem, UrlType } from "./Fetch/response.types";


const findUrl = <T extends IUrlItem<UrlType>>(type: UrlType, arr: T[]): string | null => {
	const target = arr.find(el => el.type === type);
	if (target) return target.url;

	return null;
};

const concateImgPath = (obj: IThumbnail): string => {
	return `${obj.path}.${obj.extension}`;
};

export {
	findUrl,
	concateImgPath
};