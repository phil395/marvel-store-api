const API = {
    BASE_URL: 'https://gateway.marvel.com/v1/public',
    LABEL: '1',
    PUBLIC_KEY: '65761d4798cf7ace0f43263363877f2c',
    STATIC_HASH: '3b886c1985c8e62c7bc4598d12273160',
};
const DEFAULT_SETTINGS = {
    LIMIT: 100,
    INITIAL_OFFSET: 0,
    MIN_DESCR_LENGTH: 7,
    IMG_PATH_BLACKLIST: [
        'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available',
        'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708'
    ]
};
const CHARACTERS_SETTINGS = {
    MAX_COMICS_QTY: 7,
    MIN_SET_SIZE_FOR_RANDOM: 25,
    SEARCH_PARAM_FOR_NAME: 'nameStartsWith'
};
export { API, DEFAULT_SETTINGS, CHARACTERS_SETTINGS };
