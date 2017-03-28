'use strict';

const Events = require('events');

class Protocols extends Events {
    constructor() {
        super();
        this.values = {};
        this.script = {};
        this.scripts = {
            'start': {
                'question': 'Hola soy ManuelBot, un asistente para guiarte por el historial profesional de Manuel Alfaro Sierra, que deseas hacer ?',
                'error': 'Disculpame soy algo joven.. No he entendio que deseas "cv" o "ayuda" ?',
                'matcher': '\\bcv\\b|\\bayuda\\b',
                'valueName': 'optionMenu'
            },
            'cv': {
                'question': 'En que formato lo quieres "apk" o "pdf" ?',
                'error': 'Disculpame soy algo joven.. No he entendio que deseas "apk" o "pdf" ?',
                'matcher': '\\bapk\\b|\\bpdf\\b',
                'valueName': 'docType'
            },
            'pdf': [],
            'apk': [{
                'question': 'Te gustia poder depurar la apk, Si/No ?',
                'error': 'Disculpame soy algo joven.. No he entendio que deseas "si" o "no" ?',
                'matcher': '\\bsi\\b|\\bno\\b',
                'valueName': 'mode'
            }, {
                'question': 'Que version le ponemos [Formato: NNN.NNN.NNN ej: 100.0.1] ? ',
                'error': 'Disculpame soy algo joven.. No he entendio el formato, prueba con algo como 200.1.1 ?',
                'matcher': '([0-9]{1,3})\\.([0-9]{1,3})\\.([0-9]{1,3})',
                'valueName': 'versionApp'
            }, {
                'question': 'Me gustaria dedicarte la compilacion, a que nombre quieres que apezca ? ',
                'error': 'Disculpame soy algo joven.. No uses nombres demasiados largos, maximo 100 caracteres ?',
                'matcher': '^[\\w\\s.*]{1,100}$',
                'valueName': 'greetings'
            }]
        };
    }

    _processResponse(response) {
        try {
            let match = response.match(new RegExp(this.script.matcher, 'i'));
            let value = match[0].trim().toLowerCase();
            if (!value) throw new Error();
            this.values[this.script.valueName] = value;
            let script = this.script;

            if (!script.isArray) {
                this.script.isArray = Array.isArray(this.scripts[value]); // Resolve is next questions is array
                this.script = (this.script.isArray) ? Object.assign(this.scripts[value][0]) : Object.assign(this.scripts[value]);
                this.script.name = value;
            } else {
                let index = this.scripts[this.script.name].map((value, index) => {
                    if (this.script.question === value.question) return index;
                });
                if (index >= this.scripts[value].length) {
                    this.emit('script:questions:finish', this.values);
                } else {
                    this.script.isArray = Array.isArray(this.scripts[value][index + 1]);
                    this.script = Object.assign(this.scripts[value][index + 1]);
                    this.script.name = script.name;
                }
            }

        } catch (err) {
            this.emit('script:question:ready', this.script.error);
        } finally {
            this.emit('script:question:ready', this.script.question);
        }
    }

    next(response) {
        this._processResponse(response);
    }

    start() {
        this.script = this.scripts.start;
        this.script.name = 'start';
        this.script.isArray = Array.isArray(this.scripts.start);
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

const protocols = new Protocols();

function _handleResponse(response) {
    protocols.next(response);
}

function _handleQuestionReady(question) {
    rl.question(question, _handleResponse.bind());
}


protocols.on('script:question:ready', _handleQuestionReady);
protocols.start();
