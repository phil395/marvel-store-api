import { API } from "../../config";
const { BASE_URL, LABEL, PUBLIC_KEY, STATIC_HASH } = API;
class FetchData {
    path;
    limit;
    constructor(path, limit) {
        this.path = path;
        this.limit = limit;
    }
    async fetch(urlPart) {
        const url = `${BASE_URL}/${urlPart}&ts=${LABEL}&apikey=${PUBLIC_KEY}&hash=${STATIC_HASH}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error in ${this.path} fetching. Status: ${response.status} (${response.statusText})`);
        }
        return await response.json();
    }
    fetchSet(offset) {
        const urlPart = `${this.path}?limit=${this.limit}&offset=${offset}`;
        return this.fetch(urlPart);
    }
    fetchWithCustomParams(params) {
        const entries = Object.entries(params);
        const serializedParams = entries.map(([key, value]) => `${key}=${value}`).join('&');
        const urlPart = `${this.path}?${serializedParams}`;
        return this.fetch(urlPart);
    }
}
export default FetchData;
