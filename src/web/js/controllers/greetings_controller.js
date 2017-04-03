'use strict';

const GreetingsView = require('../views/login_view');



class GreetingsController {
    constructor() {
        this.greetingsView = new GreetingsView({});

    }

    _setListeners() {
        this.greetingsView.on('greetings:init', this._init.bind(this));
    }

    _init() {
        APP.getRegion().show(this.loginView);
    }
}
