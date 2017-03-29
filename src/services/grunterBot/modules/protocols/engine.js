'use strict';

const Events = require('events');
const _ = require('lodash/array');

class Engine extends Events {
    constructor() {
        super();
        this.values = {};
        this.script = {};
        this.scripts = require('./protocols');
    }

    _checkAyuda(response) {
        let match = response.match(new RegExp('\\bayuda\\b', 'i'));
        if (match) {
            this.script = Object.assign({}, this.scripts.ayuda);
            this.script.name = 'ayuda';
            return true;
        }
        return false;
    }

    _processResponse(response) {
        let script = {};
        try {
            if (this._checkAyuda(response)) return;
            let match = response.match(new RegExp(this.script.matcher, 'i'));
            let value = match[0].trim().toLowerCase();
            if (!value) {
                throw new Error();
            }

            script = Object.assign({}, this.script);
            this.script = {};
            this.values[this.script.valueName] = value;

            if (script.next === 'matcher') {
                this.script = (Array.isArray(this.scripts[value])) ? Object.assign(this.script, this.scripts[value][0]) : Object.assign(this.script, this.scripts[value]);
                this.script.name = value;
            } else if (script.next === 'question') {
                let index = _.findIndex(this.scripts[script.name], {
                    question: script.question
                });
                if (index < this.scripts[script.name].length) {
                    this.script = Object.assign(this.script, this.scripts[script.name][index + 1]);
                    this.script.name = script.name;
                }
            } else if (script.next === 'ayuda') {
                this.script = Object.assign({}, this.scripts.ayuda);
                this.script.name = script.next;
            } else {
                console.log('Something go wrong, "next" action %s no allowed', script.next);
            }

        } catch (err) {
            console.log('regex: %s', this.script.matcher);
            console.log('string: %s', response);
            console.log(err.stack);
            this.emit('script:question:ready', this.script.error);
        } finally {
            if (script.triggerEvent) {
                this.emit(script.triggerEvent, this.values);
            }
            this.emit('script:question:ready', this.script.question);
        }
    }

    next(response) {
        this._processResponse(response);
    }

    start() {
        this.script = this.scripts.start;
        this.script.name = 'start';
        this.emit('script:question:ready', this.script.question);
    }
}

// TEST
const readline = require('readline');
let events = new Events();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const engine = new Engine();

function _handleResponse(response) {
    engine.next(response);
}

function _handleQuestionReady(question) {
    rl.question(question + ' > ', _handleResponse.bind());
}


function _handleFinishApk(values) {
    console.log('finish apk %s', JSON.stringify(values));
}

function _handleFinishPdf(values) {
    console.log('finish pdf %s', JSON.stringify(values));
}


engine.on('script:question:ready', _handleQuestionReady);
engine.on('script:apk:finish', _handleFinishApk);
engine.on('script:pdf:finish', _handleFinishPdf);
engine.start();
