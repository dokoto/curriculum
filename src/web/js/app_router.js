'use strict';

const Backbone = require('backbone');
const Marionette = require('backbone.marionette');

/*
 * appRoutes
 * Route calls format
 * 'path': 'file name'
 * path: Listener declaration : event.on('path:to_whatver', function)
 * file name: if file name is login_controller.js the file name would be 'login'
 */
class Router extends Marionette.AppRouter {
    constructor(...args) {
        super({
            controller: args[0].controller,
            appRoutes: {
                'greetings:init': 'greetings',
                'chat:init': 'chat',
            }
        });
    }

    onRoute(name, path, args) {
        this._goto(this._onRouteActions(name, path, args));
    }

    _onRouteActions(name, path, args) {
        let params = {
            name: name,
            path: path,
            args: args,
            continue: true
        };

        if (name === 'initialize') {
            params.continue = false;
            return params;
        }


        if (APP.router.history) {
            APP.router.history.push({
                'name': params.name,
                'path': params.path
            });
            if (APP.router.history.length > 2 && APP.router.history[APP.router.history.length - 1].path === 'go:chat') {
                params.path = APP.router.history[APP.router.history.length - 2].path;
                params.name = APP.router.history[APP.router.history.length - 2].name;
            }
        }

        return params;
    }

    _goto(params) {
        if (!params.continue) {
            return;
        }
        console.log('[ROUTER] Navigating to "%s"', params.path);
        const GenericCotroller = require('./controllers/' + params.name + '_controller');
        let genericCotroller = new GenericCotroller(params.args);
        genericCotroller.trigger(params.path);
    }
}

module.exports = Router;
