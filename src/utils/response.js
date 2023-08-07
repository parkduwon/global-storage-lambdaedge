exports.responseUpdate = (response, {status, statusDescription, body, bodyEncoding }) => {
    response.status = status;
    response.statusDescription = statusDescription;
    response.body = body;
    if (bodyEncoding) {
        response.bodyEncoding = bodyEncoding;
    }

    return response
}

const hasSize = (queryParams) => queryParams.w && queryParams.h
const isWebq = (queryParams) => queryParams.webq === 'Y'

exports.shouldResizeImage = (queryParams) => hasSize(queryParams) || isWebq(queryParams)
