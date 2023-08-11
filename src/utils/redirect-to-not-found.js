exports.isStatusNotFound = (response) => response?.status === '404';

exports.redirectToNotFound = (request, response, callback) => {
    const foodspringNotFoundPageUrl = 'https://globalcf.dev.marketboro.com/error/foodspring/404.html';
    const marketbomNotFoundPageUrl = 'https://globalcf.dev.marketboro.com/error/marketbom/404.html';


    if (request?.uri?.split('/')[1] === 'foodspring') {
        response.status = '302';
        response.headers.location = [{key: 'Location', value: foodspringNotFoundPageUrl}]
    } else {
        response.status = '302';
        response.headers.location = [{key: 'Location', value: marketbomNotFoundPageUrl}];
    }
    callback(null, response);
}