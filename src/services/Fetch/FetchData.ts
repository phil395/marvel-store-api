import { API } from "../../config";
import type { IFailedResponse, INativeCharacter, INativeComic, ISuccessfulResponse } from "./response.types";

const { BASE_URL, LABEL, PUBLIC_KEY, STATIC_HASH } = API;

class FetchData<T extends INativeCharacter | INativeComic> {

	constructor(
		public path: T extends INativeCharacter ? 'characters' : 'comics',
		private limit: number
	) { }


	private async fetch(urlPart: string): Promise<ISuccessfulResponse<T> | IFailedResponse> {
		const url = `${BASE_URL}/${urlPart}&ts=${LABEL}&apikey=${PUBLIC_KEY}&hash=${STATIC_HASH}`;

		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Error in ${this.path} fetching. Status: ${response.status} (${response.statusText})`);
		}

		return await response.json();
	}


	fetchSet(offset: number): Promise<ISuccessfulResponse<T> | IFailedResponse> {
		const urlPart = `${this.path}?limit=${this.limit}&offset=${offset}`;

		return this.fetch(urlPart);
	}

	fetchWithCustomParams(params: Record<string, string | number>): Promise<ISuccessfulResponse<T> | IFailedResponse> {
		const entries = Object.entries(params);
		const serializedParams = entries.map(([key, value]) => `${key}=${value}`).join('&');

		const urlPart = `${this.path}?${serializedParams}`;

		return this.fetch(urlPart);
	}

}

export default FetchData;