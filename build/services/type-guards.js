const isSuccessfulResponse = (answer) => {
    if (answer.code === 200)
        return true;
    return false;
};
const isNativeCharacter = (item) => {
    if ('pageCount' in item)
        return false;
    return true;
};
export { isSuccessfulResponse, isNativeCharacter };
