'use strict';

const sinon = require('sinon');
const _ = require('underscore');
const mockPool = require('./mocks/mockPool');

class Mocker {
    constructor(options) {
        console.log('%c[MOCKER] Activated', 'background:red; color:yellow');
        this.mocks = mockPool.get();
    }

    run() {
        // Añadimos los mocks correspondientes
        this.mocks = _.flatten(this.mocks);

        //Si no hay mocks no continuamos
        if (this.mocks.length === 0) {
            return;
        }

        var server = sinon.fakeServer.create();
        server.xhr.useFilters = true;
        server.respondImmediately = true;

        _.each(this.mocks, function(obj, value) {
            server.respondWith(obj.method, obj.url, obj.handle);
        });

        server.xhr.addFilter(function(method, url) {
            //whenever the this returns true the request will not faked
            var matching = false;
            _.each(this.mocks, function(obj) {
                if (!matching) {
                    matching = url.match(obj.url) ? true : false;
                }
            });
            return !matching;
        }.bind(this));
    }
}

module.exports = Mocker;
