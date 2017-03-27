'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const definitions = require('./definitions');

class Restful {
    constructor() {
        this.app = express();
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(methodOverride('X-HTTP-Method-Override'));
        this.app.use('/', definitions);
    }
}

module.exports = Restful;
