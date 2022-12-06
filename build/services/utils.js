const findUrl = (type, arr) => {
    const target = arr.find(el => el.type === type);
    if (target)
        return target.url;
    return null;
};
const concateImgPath = (obj) => {
    return `${obj.path}.${obj.extension}`;
};
export { findUrl, concateImgPath };
