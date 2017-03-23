'use strict';

const imagesResponseGET = require('json!js/helpers/mocks/responses/GET/imagesResponse.json');

module.exports = [{
    active: false,
    method: 'GET',
    url: /v1\/vehicles\/images/,
    handle: function(xhr) {
        xhr.respond(200, {
            'Content-Type': 'application/json'
        }, JSON.stringify(imagesResponseGET));
        console.log('[MOCKER] Servicio mockeado %s %o', xhr.url, imagesResponseGET);
    }
}];
