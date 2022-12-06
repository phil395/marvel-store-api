declare const API: {
    BASE_URL: string;
    LABEL: string;
    PUBLIC_KEY: string;
    STATIC_HASH: string;
};
declare const DEFAULT_SETTINGS: {
    LIMIT: number;
    INITIAL_OFFSET: number;
    MIN_DESCR_LENGTH: number;
    IMG_PATH_BLACKLIST: string[];
};
declare const CHARACTERS_SETTINGS: {
    MAX_COMICS_QTY: number;
    MIN_SET_SIZE_FOR_RANDOM: number;
    SEARCH_PARAM_FOR_NAME: string;
};
export { API, DEFAULT_SETTINGS, CHARACTERS_SETTINGS };
