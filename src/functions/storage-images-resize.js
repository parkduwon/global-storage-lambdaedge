const querystring = require('querystring');
const {redirectToNotFound, isStatusNotFound} = require('../utils/redirect-to-not-found')
const {responseUpdate, shouldResizeImage} = require("../utils/response");
const {getSizeFromQueryParams, resize} = require("../utils/image");
const {getObjectBuffer} = require('../utils/s3-client')


exports.handler = async (event, context, callback) => {
    const {request, response} = event.Records[0].cf;
    let queryParams;
    let objectKey;
    let inputBuffer;
    let convertedBuffer;

    if (isStatusNotFound(response)) return redirectToNotFound(request, response, callback)

    try {
        // Parameters are w, h, q, webp and indicate width, height, quality and webp convert.
        queryParams = querystring.parse(request.querystring);
        objectKey = request.uri.substring(1);
        console.log('params: ', queryParams);
        console.log('objectKey: ', request.uri.substring(1));
    } catch (error) {
        // Extract name and format.
        console.log(error);
        return (error);
    }

    //false then return origin
    if (!shouldResizeImage(queryParams)) {
        return callback(null, response);
    }


    try {
        inputBuffer = await getObjectBuffer(request, objectKey);
    } catch (error) {
        console.error('error from getObjectFromS3: ', error);
        return redirectToNotFound(request, response, callback)
    }


    // get resize option from query params
    const {width, height, quality} = getSizeFromQueryParams(queryParams);

    try {
        convertedBuffer = await resize(inputBuffer, {width, height, quality})
    } catch (error) {
        console.log(error);
        responseUpdate(
            response,
            {
                status: 500,
                statusDescription: 'Internal Server Error',
                body: 'Image Convert Fail Error.',
            },
        );
        return callback(null, response);
    }

    // `response.body`가 변경된 경우 1MB 까지만 허용됩니다.
    if (convertedBuffer.byteLength >= 1048576) {
        console.warn('image response body over 1mb: ', convertedBuffer.byteLength)
        return callback(null, response);
    }

    responseUpdate(
        response,
        {
            status: 200,
            statusDescription: 'OK',
            body: convertedBuffer.toString('base64'),
        }
    );

    return callback(null, response);
}