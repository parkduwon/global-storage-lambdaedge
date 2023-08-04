exports.handler = (event, context, callback) => {
    const foodspringNotFoundPageUrl = 'https://globalcf.dev.marketboro.com/error/foodspring/404.html';
    const marketbomNotFoundPageUrl = 'https://globalcf.dev.marketboro.com/error/marketbom/404.html';

    const {request, response} = event.Records[0].cf;

    // 정상이 아닐때 모두 not found로 이동하도록 처리
    if (response.status !== '200') {
        response.status = '302';
        if (response.uri && request.uri.split('/')[1] === 'foodspring'){
            response.headers.location = [{key: 'Location', value: foodspringNotFoundPageUrl}]
        } else {
            response.headers.location = [{key: 'Location', value: marketbomNotFoundPageUrl}];
        }
        callback(null, response);
        return
    }

    if(request.uri.split('/'))
    callback(null, response)
};