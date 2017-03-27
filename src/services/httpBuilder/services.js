'use strict';

const router = require('express').Router();
const GrunterCli = require('../grunterCli/grunter-cli');

// GET /api/v1/android
// curl -k "https://127.0.0.1:8080/api/v1/android?task=build-web&mode=dev&versionapp=999&mocks=false&verbose=true"
router.get('/android', function(request, response) {
    console.debug('%s', JSON.stringify(request.query));
    let grunterCli = new GrunterCli(request.query);
    grunterCli.run();
    response.status(200).json('{error: false}');
});

module.exports = router;
