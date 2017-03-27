'use strict';

const Events = require('events');

class Protocols extends Events {
    constructor() {
        this.script = {};
        this.scripts = {
            'start': {
                'question': 'Hola soy ManuelBot, un asistente para guiarte por el historial profesional de Manuel Alfaro Sierra, que deseas hacer ?',
                'error': 'Disculpame soy algo joven.. No he entendio que deseas "cv" o "ayuda" ?',
                'matcher': '\\cv\\b|\\bayuda\\b',
            },
            'cv': {
                'question': 'En que formato lo quieres "apk" o "pdf" ?',
                'error': 'Disculpame soy algo joven.. No he entendio que deseas "apk" o "pdf" ?',
                'matcher': '\\bapk\\b|\\bpdf\\b',
            },
            'pdf': [],
            'apk': [{
                'question': 'Te gustia poder depurar la apk, Si/No ?',
                'error': 'Disculpame soy algo joven.. No he entendio que deseas "si" o "no" ?',
                'matcher': '\\bapk\\b|\\bpdf\\b',
            }, {
                'question': 'Que version le ponemos [Formato: NNN.NNN.NNN ej: 100.0.1] ? ',
                'error': 'Disculpame soy algo joven.. No he entendio el formato, prueba con algo como 200.1.1 ?',
                'matcher': '\\bapk\\b|\\bpdf\\b',
            }, {
                'question': 'Me gustaria dedicarte la compilacion, a que nombre quieres que apezca ? ',
                'error': 'Disculpame soy algo joven.. No uses nombres demasiados largos, maximo 100 caracteres ?',
                'matcher': '\\bapk\\b|\\bpdf\\b',
            }]
        };
    }

    _nextQuestion(response) {
        try {
            let match = response.match(new RegExp(this.script.matcher, 'i'));
            let value = match[0].trim().toLowerCase();
            let script = this.script;
            if (!script.isArray) {
                this.script.isArray = Array.isArray(this.scripts[value]);
                this.script = (this.script.isArray) ? Object.asign(this.scripts[value][0]) : Object.asign(this.scripts[value]);
                this.script.name = value;
            } else {
                let index = this.scripts[this.script.name].map((value, index) => {
                    if (this.script.question === value.question) return index;
                });
                if (index >= this.scripts[value].length) {
                    // Call to method
                } else {
                    this.script.isArray = Array.isArray(this.scripts[value][index + 1]);
                    this.script = Object.asign(this.scripts[value][index + 1]);
                    this.script.name = script.name;
                }
            }
        } catch (err) {

        }
    }

    tell(response) {
        this._nextQuestion(response);
        this.emit('process:success', this.script.question);
        this.emit('process:error', this.script.error);
    }

    start() {
        this.script = this.scripts.start;
        this.script.name = 'start';
        this.script.isArray = Array.isArray(this.scripts.start);
        this.emit('process:success', this.script.question);
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

function _handleNextDialog(question) {
    rl.question(question, _handleResponse.bind());
}

protocols.on('process:success', _handleNextDialog);
protocols.start();
