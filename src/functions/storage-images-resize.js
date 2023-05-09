const {S3Client, GetObjectCommand} = require("@aws-sdk/client-s3");
const sharp = require('sharp');
const querystring = require('querystring');

const s3Client = new S3Client({region: 'ap-northeast-2'});

exports.handler = async (event, context, callback) => {
    const {request, response} = event.Records[0].cf;
    const s3BucketName = request.origin.s3.domainName.split(".")[0]
    let queryParams;
    let objectKey;

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

    let isOriginResponse = true;
    if (queryParams.w && queryParams.h) {
        isOriginResponse = false;
    }
    if (queryParams.webp === 'Y') {
        isOriginResponse = false;
    }

    //false then return origin
    if (isOriginResponse) {
        return callback(null, response);
    }

    // Init variables
    const width = parseInt(queryParams.w, 10) ? parseInt(queryParams.w, 10) : null;
    const height = parseInt(queryParams.h, 10) ? parseInt(queryParams.h, 10) : null;
    const quality = parseInt(queryParams.q, 10) ? parseInt(queryParams.q, 10) : 70;

    let contentType;
    let inputBuffer;
    let convertedBuffer;

    try {
        const getObjectParams = {Bucket: s3BucketName, Key: objectKey};
        const inputData = await s3Client.send(new GetObjectCommand(getObjectParams));
        contentType = inputData.ContentType;
        inputBuffer = await inputData.Body.transformToByteArray();
    } catch (error) {
        console.error('error from getObjectFromS3: ', error);
        responseUpdate(
            404,
            'Not Found',
            'The image does not exist.',
            [{key: 'Content-Type', value: 'text/plain'}],
        );
        return callback(null, response);
    }

    try {
        convertedBuffer = await sharp(inputBuffer, {animated: true})
            .resize({width: width, height: height})
            .webp({effort: 0, quality: quality})
            .toBuffer();
    } catch (error) {
        console.log(error);
        responseUpdate(
            500,
            'Internal Server Error',
            'Image Convert Fail Error.',
            [{key: 'Content-Type', value: 'text/plain'}],
        );
        return callback(null, response);
    }

    // `response.body`가 변경된 경우 1MB 까지만 허용됩니다.
    if (convertedBuffer.byteLength >= 1048576) {
        console.log('image response body over 1mb: ', convertedBuffer.byteLength)
        return callback(null, response);
    }

    responseUpdate(
        200,
        'OK',
        convertedBuffer.toString('base64'),
        [{key: 'Content-Type', value: contentType}],
        'base64'
    );

    return callback(null, response);

    function responseUpdate(status, statusDescription, body, contentHeader, bodyEncoding = undefined) {
        response.status = status;
        response.statusDescription = statusDescription;
        response.body = body;
        if (bodyEncoding) {
            response.bodyEncoding = bodyEncoding;
        }
    }
}