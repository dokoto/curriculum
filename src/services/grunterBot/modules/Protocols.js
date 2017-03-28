'use strict';

const Events = require('events');
const _ = require('lodash/array');

class Protocols extends Events {
    constructor() {
        super();
        this.values = {};
        this.script = {};
        this.scripts = {
            'start': {
                'question': 'Hola soy ManuelBot, un asistente para guiarte por el historial profesional de Manuel Alfaro Sierra, que deseas hacer ? Puedes pedir la "ayuda" en cualquie momento',
                'error': 'Disculpame soy algo joven.. No he entendio que deseas "cv" o "ayuda" ?',
                'matcher': '\\bcv\\b|\\bconsulta\\b',
                'valueName': 'optionMenu',
                'next': 'matcher'
            },
            'ayuda': {
                'question': `Hola soy un asistente que tratar de enteder lo que me pides usando expresiones regulares. Espero crecer algun dia y
ser como mis hermanos mayores del Deep Learning. Pero por ahora estoy limitado a tratar de entender palabras dentro de lo que me escribes.
Sientete en libertad de escrir frases y disculpame si a veces no te entiendo.
Los comandos que estan siempre a tu disposicion son:
  "ayuda": Siempre a tu disposicion, mostrara este mismo texto.
  "cv": Te guiare para que obtengas una copia del cv de Manuel Alfaro Sierra en  pdf o en una App para android.
  "consulta": Donde atraves de preguntas te dare informacion del cv de Manuel.`,
                'error': 'Que embarazoso.. no te he entendido puedes tratar de repetirlo ?',
                'matcher': '\\bcv\\b|\\bconsulta\\b',
                'valueName': 'docType',
                'next': 'matcher'
            },
            'cv': {
                'question': 'En que formato lo quieres "apk" o "pdf" ?',
                'error': 'Disculpame soy algo joven.. No he entendio que deseas "apk" o "pdf" ?',
                'matcher': '\\bapk\\b|\\bpdf\\b',
                'valueName': 'docType',
                'next': 'matcher'
            },
            'pdf': {
                'question': 'Deseas que te lo envie por "email" por al "chat" ?',
                'error': 'Disculpame soy algo joven.. No he entendio que deseas "email" o "chat" ?',
                'matcher': '\\bemail\\b|\\bchat\\b',
                'valueName': 'transport',
                'next': 'matcher'
            },
            'chat': {
                'question': 'Ya esta enviado, . Te gustaria hacer algo mas ? Puesdes pedir la "ayuda" ',
                'error': 'Disculpame soy algo duro de oido.. Sino sabes que hacer pide la ayuda ?',
                'matcher': '\\bcv\\b|\\bconsulta\\b',
                'valueName': 'optionMenu',
                'triggerEvent': 'script:pdf:finish',
                'next': 'matcher'
            },
            'email': [{
                'question': 'Sin problemas en breve te llegara un correo con el cv en pdf, puedes darme tu email ?',
                'error': 'Disculpame soy algo joven.. Pero el email parece erroneo. Puedes escribirlo de nuevo ?',
                'matcher': '^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$',
                'valueName': 'email',
                'next': 'question'
            }, {
                'question': 'Ya esta enviado, . Te gustaria hacer algo mas ? Puesdes pedir la "ayuda" ',
                'error': 'Disculpame soy algo duro de oido.. Sino sabes que hacer pide la ayuda ?',
                'matcher': '\\bcv\\b|\\bconsulta\\b',
                'valueName': 'optionMenu',
                'triggerEvent': 'script:pdf:finish',
                'next': 'matcher'
            }],
            'apk': [{
                'question': 'En modo te gustaria compilar la apk, en "release" o "debug" ?',
                'error': 'Disculpame soy algo joven.. No he entendio que deseas "release" o "debug" ?',
                'matcher': '\\brelease\\b|\\bdebug\\b',
                'valueName': 'mode',
                'next': 'question'
            }, {
                'question': 'Que version le ponemos [Formato: NNN.NNN.NNN ej: 100.0.1] ? ',
                'error': 'Disculpame soy algo joven.. No he entendio el formato, prueba con algo como 200.1.1 ?',
                'matcher': '([0-9]{1,3})\\.([0-9]{1,3})\\.([0-9]{1,3})',
                'valueName': 'versionApp',
                'next': 'question'
            }, {
                'question': 'Me gustaria dedicarte la compilacion, a que nombre quieres que apezca ? ',
                'error': 'Disculpame soy algo joven.. No uses nombres demasiados largos, maximo 100 caracteres ?',
                'matcher': '^[\\w\\s.*]{1,100}$',
                'valueName': 'greetings',
                'next': 'question'
            }, {
                'question': 'La APK se esta cocinando te enviare un enlace de descarga cuando termine. Te gustaria hacer algo mas ? Puesdes pedir la "ayuda" ',
                'error': 'Disculpame soy algo duro de oido.. Sino sabes que hacer pide la ayuda ?',
                'matcher': '\\bcv\\b|\\bconsulta\\b',
                'valueName': 'optionMenu',
                'triggerEvent': 'script:apk:finish',
                'next': 'matcher'
            }]
        };
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
        try {
            if (this._checkAyuda(response)) return;

            let match = response.match(new RegExp(this.script.matcher, 'i'));
            let value = match[0].trim().toLowerCase();
            if (!value) throw new Error();

            this.values[this.script.valueName] = value;
            let script = Object.assign({}, this.script);

            if (script.next === 'matcher') {
                this.script = (Array.isArray(this.scripts[value])) ? Object.assign(this.script, this.scripts[value][0]) : Object.assign(this.script, this.scripts[value]);
                this.script.name = value;
            } else if (script.next === 'question') {
                let index = _.findIndex(this.scripts[this.script.name], {
                    question: this.script.question
                });
                if (index < this.scripts[script.name].length) {
                    this.script = Object.assign(this.script, this.scripts[script.name][index + 1]);
                    this.script.name = script.name;
                }
            } else if (script.next === 'ayuda') {
                this.script = Object.assign({}, this.scripts.ayuda);
                this.script.name = script.next;
            } else {
                console.log('Something go wrong, next acttion %s no allowed', script.next);
            }

        } catch (err) {
            console.log(err.stack);
            this.emit('script:question:ready', this.script.error);
        } finally {
            if (this.script.triggerEvent) this.emit(this.script.triggerEvent, this.values);
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

const protocols = new Protocols();

function _handleResponse(response) {
    protocols.next(response);
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


protocols.on('script:question:ready', _handleQuestionReady);
protocols.on('script:apk:finish', _handleFinishApk);
protocols.on('script:pdf:finish', _handleFinishPdf);
protocols.start();
