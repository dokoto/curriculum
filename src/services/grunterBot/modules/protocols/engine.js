'use strict';

const Events = require('events');
const _ = require('lodash/array');
const scripts = require('./protocols');

class Engine extends Events {
    constructor() {
        super();
        this.values = {};
        this.script = {};
    }

    _checkDirectCommands(response) {
        let match = response.match(new RegExp(scripts.ayuda.matcher, 'i'));
        if (match) {
            this.script = Object.assign({}, scripts[match]);
            this.script.name = match;
            return true;
        }
        return false;
    }

    _resolveCommand(script, value) {
        if (script.next === 'matcher') {
            this.script = (Array.isArray(scripts[value])) ? Object.assign(this.script, scripts[value][0]) : Object.assign(this.script, scripts[value]);
            this.script.name = value;
        } else if (script.next === 'question') {
            let index = _.findIndex(scripts[script.name], {
                question: script.question
            });
            if (index < scripts[script.name].length) {
                this.script = Object.assign(this.script, scripts[script.name][index + 1]);
                this.script.name = script.name;
            }
        } else if (script.next === 'ayuda') {
            this.script = Object.assign({}, scripts.ayuda);
            this.script.name = script.next;
        } else {
            console.printf('Something go wrong, "next" action %s no allowed', script.next);
        }
    }

    _extractCommand(response) {
        let script, value;

        let match = response.match(new RegExp(this.script.matcher, 'i'));
        if (!match) {
            throw new Error();
        }
        value = match[0].trim().toLowerCase();

        script = Object.assign({}, this.script);
        this.script = {};
        this.values[this.script.valueName] = value;

        return [script, value];
    }

    _processResponse(id, response) {
        let script = {};
        try {
            if (this._checkDirectCommands(response)) return;
            let [script, value] = this._extractCommand(response);
            this._resolveCommand(script, value);
        } catch (err) {
            console.debug('regex: %s', this.script.matcher);
            console.debug('string: %s', response);
            console.error(err.stack);
            this.emit('script:question:ready', id, this.script.error);
        } finally {
            if (script.triggerEvent) {
                this.emit(script.triggerEvent, id, this.values);
            }
            this.emit('script:question:ready', id, this.script.question);
        }
    }

    next(id, response) {
        this._processResponse(id, response);
    }

    start(id) {
        this.script = scripts.start;
        this.script.name = 'start';
        this.emit('script:question:ready', id, this.script.question);
    }
}

module.exports = Engine;
