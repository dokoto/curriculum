'use strict';

const deviceResponseGET = require('json!js/helpers/mocks/responses/GET/devicesResponse.json');

module.exports = [{
    active: false,
    method: 'GET',
    url: /\/devices?.*/,
    handle: function(xhr) {
        xhr.respond(200, {
            'Content-Type': 'application/json'
        }, JSON.stringify(deviceResponseGET));
        console.log('[MOCKER] Servicio mockeado %s %o', xhr.url, deviceResponseGET);
    }
}];
