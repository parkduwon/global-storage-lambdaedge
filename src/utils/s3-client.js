const {S3Client, GetObjectCommand} = require("@aws-sdk/client-s3");

const s3Client = new S3Client({region: 'ap-northeast-2'});

exports.getObjectBuffer = async(request, objectKey) => {
    const s3BucketName = request.origin.s3.domainName.split(".")[0]

    const getObjectParams = {Bucket: s3BucketName, Key: objectKey};
    const inputData = await s3Client.send(new GetObjectCommand(getObjectParams));
    return inputData.Body.transformToByteArray();
}