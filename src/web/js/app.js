'use strict';

const Backbone = require('backbone');
const Marionette = require('backbone.marionette');
const AppRouter = require('./app_router');
const AppController = require('./app_controller');

class App extends Marionette.Application {
    constructor() {
        super({
            region: AppController.regions.appRegion,
            onBeforeStart: (options, args) => {
                console.log('[APP] onBeforeStart');
            },

            onStart: (options, args) => {
                console.log('onStart. Options: %o', args);
                if (Backbone.History.started === false) {
                    Backbone.history.start();
                }
                APP.router.navigate('greetings:init', {
                    trigger: true
                });
            }
        });

        this.router = new AppRouter({
            controller: AppController
        });

        this.regions = AppController.regions;
    }
}

window.APP = new App();
window.APP.start();
