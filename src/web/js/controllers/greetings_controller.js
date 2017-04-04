'use strict';

const _ = require('underscore');
const Backbone = require('backbone');
const GreetingsView = require('../views/greetings');
const constants = require('../../../assets/config/constants');

class GreetingsController {
    constructor() {
        _.extend(this, Backbone.Events);
        this.greetingsView = new GreetingsView({
            greetings: constants.GREETINGS,
            build_date: constants.BUILD_DATE,
            version: constants.VERSION_APP,
            title: constants.APP_DESCRIPTION
        });
        this._setListeners();
    }

    _setListeners() {
        this.on('greetings:init', this._init.bind(this));
    }

    _init() {
        APP.getRegion().show(this.greetingsView);
    }
}


module.exports = GreetingsController;
