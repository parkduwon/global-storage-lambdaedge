const sharp = require('sharp');

exports.getSizeFromQueryParams = (queryParams) => {
    const width = queryParams.w ? parseInt(queryParams.w, 10) : null;
    const height = queryParams.h ? parseInt(queryParams.h, 10) : null;
    const quality = queryParams.q ? parseInt(queryParams.q, 10) : 70;

    return { width, height, quality };
};

exports.resize = async (inputBuffer, { width, height, quality }) =>
    sharp(inputBuffer, { animated: true }).resize({ width, height }).webp({ effort: 0, quality }).toBuffer();
