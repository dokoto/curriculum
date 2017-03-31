'use strict';

const SetGlobals = require('./utils/setGlobals');
const TelegramDaemon = require('./modules/telegramAPI/telegramDaemon');
const EngineProtocol = require('./modules/protocols/engine');
const path = require('path');
const Mailer = require('./utils/mailer');

class GrunterBot {
    constructor() {
        SetGlobals.run();
        this.incomingMessage = {};
        this.users = {};
        this.telegramBot = new TelegramDaemon();
        this.mailer = new Mailer();
    }

    _handleQuestionReady(id, question) {
        this.telegramBot.sendMessage({
            chat_id: id,
            text: question
        });
    }

    _handleFinishApk(id, values) {
        console.printf('APK values %s', JSON.stringify(values));
    }

    _handleFinishPdf(id, values) {
        console.printf('PDF values %s', JSON.stringify(values));
        this._managePDFSend(id, values);
    }

    _managePDFSend(id, values) {
        if (values.transport === 'chat') {
            this.telegramBot.sendDocument({
                chat_id: id,
                files: {
                    document: path.join(process.cwd(), 'src/assets/cv/es/cv.pdf')
                }
            });
        } else if (values.transport === 'email') {
            this.mailer.send('dokoto.moloko@gmail', null, 'TEST BOT', 'BODY TEST BOT');
        }
    }

    _handleTelegramIncomingMsg(message) {
        if (!this.users[message.from.id]) {
            this.users[message.from.id] = {};
            this.users[message.from.id].engine = new EngineProtocol();
            this._configEngineProtocol(this.users[message.from.id].engine);
            this.users[message.from.id].engine.start(message.from.id);
        } else {
            this.users[message.from.id].lastMessage = {
                'message': message,
                create: new Date()
            };
            this.users[message.from.id].engine.next(message.from.id, message.text);
        }
    }

    _starTelegramDaemon() {
        this.telegramBot.on('daemon:incoming:mesage', this._handleTelegramIncomingMsg.bind(this));
        this.telegramBot.start();
    }

    _configEngineProtocol(engine) {
        engine.on('script:question:ready', this._handleQuestionReady.bind(this));
        engine.on('script:apk:finish', this._handleFinishApk.bind(this));
        engine.on('script:pdf:finish', this._handleFinishPdf.bind(this));
    }

    run() {
        this._starTelegramDaemon();
    }

}


new GrunterBot().run();
