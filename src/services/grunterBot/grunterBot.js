'use strict';

const SetGlobals = require('./utils/setGlobals');
const TelegramDaemon = require('./modules/telegramAPI/telegramDaemon');
const EngineProtocol = require('./modules/protocols/engine');

class GrunterBot {
    constructor() {
        SetGlobals.run();
        this.incomingMessage = {};
        this.users = {};
        this.telegramBot = new TelegramDaemon();
    }

    _handleQuestionReady(id, question) {
        this.telegramBot.sendMessage({
            chat_id: id,
            text: question
        });
    }

    _handleFinishApk(id, values) {

    }

    _handleFinishPdf(id, values) {

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
