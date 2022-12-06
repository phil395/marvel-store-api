import { IThumbnail, IUrlItem, UrlType } from "./Fetch/response.types";
declare const findUrl: <T extends IUrlItem<UrlType>>(type: UrlType, arr: T[]) => string | null;
declare const concateImgPath: (obj: IThumbnail) => string;
export { findUrl, concateImgPath };
