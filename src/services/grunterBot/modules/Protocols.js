'use strict';

const Events = require('events');

class Protocols extends Events {
    constructor() {
        this.scripts = {
            'start': [{
                'question': 'Hola soy ManuelBot, un asistente para guiarte por el historial profesional de Manuel Alfaro Sierra, que deseas hacer ?',
                'error': 'Disculpame soy algo joven.. No he entendio que deseas "cv" o "ayuda" ?',
                'matcher': '\\cv\\b|\\bayuda\\b',
            }],
            '\\bcv\\b': [{
                'question': 'En que formato lo quieres "apk" o "pdf" ?',
                'error': 'Disculpame soy algo joven.. No he entendio que deseas "apk" o "pdf" ?',
                'matcher': '\\bapk\\b|\\bpdf\\b',
            }],
            '\\bpdf\\b': [],
            '\\bapk\\b': [{
                'question': 'Te gustia poder depurar la apk, Si/No ?',
                'error': 'Disculpame soy algo joven.. No he entendio que deseas "si" o "no" ?',
                'matcher': '\\bapk\\b|\\bpdf\\b',
                'step': 1
            }, {
                'question': 'Que version le ponemos [Formato: NNN.NNN.NNN ej: 100.0.1] ? ',
                'error': 'Disculpame soy algo joven.. No he entendio el formato, prueba con algo como 200.1.1 ?',
                'matcher': '\\bapk\\b|\\bpdf\\b',
                'step': 2
            }, {
                'question': 'Me gustaria dedicarte la compilacion, a que nombre quieres que apezca ? ',
                'error': 'Disculpame soy algo joven.. No uses nombres demasiados largos, maximo 100 caracteres ?',
                'matcher': '\\bapk\\b|\\bpdf\\b',
                'call': 'callbackDoSomeThing'
            }]
        };
    }

    _resolveNextDialog(response, proto, step) {
        let nextStep = {};
        let script = this.scripts[proto][step];
        let match = response.match(new RegExp(script.matcher, 'i'));
        nextStep.success = !!(match);
        nextStep.value = {};

        if (nextStep.success && nextStep.step) {
            nextStep.value = match[0].trim().toLowerCase();
            nextStep.question = this.scripts[proto][script.step];
            nextStep.step = script.step;
        } else if (nextStep.success && nextStep.call) {
            nextStep.value = match[0].trim().toLowerCase();
            nextStep.call = script.call;
        } else if (nextStep.success) {
            nextStep.value = match[0].trim().toLowerCase();
            nextStep.question = this.scripts[nextStep.value][0];
            nextStep.protocol = nextStep.value;
        } else if (!nextStep.success) {
            nextStep.error = script.error;
            nextStep.step = 0;
        }

        return nextStep;
    }

    tell(response, proto, step) {
        let nextDialog = this._resolveNextDialog(response, proto, step);
        this.emit('process:success', nextDialog.question, nextDialog.protocol);
        this.emit('process:error', nextDialog.error, nextDialog.step);
    }

    start() {
        this.emit('process:success', this.scripts.start.question, 'start', 0);
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

function _handleResponse(proto, step, response) {
    let nextDialog = protocols.tell(response, proto, step);
}

function _handleNextDialog(question, protocol, step) {
    rl.question(question, _handleResponse.bind(protocol, step));
}

protocols.on('process:success', _handleNextDialog);
protocols.start();
