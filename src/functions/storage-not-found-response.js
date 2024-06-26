const { redirectToNotFound, isStatusNotFound } = require('../utils/redirect-to-not-found');

exports.handler = async (event, context, callback) => {
    const { request, response } = event.Records[0].cf;

    // 정상이 아닐때 모두 not found로 이동하도록 처리
    if (isStatusNotFound(response)) return redirectToNotFound(request, response, callback);

    return callback(null, response);
};
