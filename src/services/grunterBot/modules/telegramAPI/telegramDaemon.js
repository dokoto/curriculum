'use strict';

const TelegramBot = require('node-telegram-bot');
const EventEmitter = require('events');

const constants = require('../../constants');

class TelegramDaemon extends EventEmitter {
    constructor() {
        super();
        this.telegramBot = new TelegramBot({
            token: constants.TELEGRAM_TOKEN
        });
    }

    start() {
        console.printf('[TELEGRAM-DAEMON] Started');
        this.telegramBot.on('message', this._handleOnIncoming.bind(this));
        this.telegramBot.start();
    }

    destroy() {
        this.telegramBot.removeAllListeners('message');
    }

    sendPhoto(options) {
        this.telegramBot.sendPhoto(options, () => this.emit('daemon:image:sent'));
    }

    sendMessage(options) {
        this.telegramBot.sendMessage(options, () => this.emit('daemon:message:sent'));
    }

    _handleOnIncoming(message) {
        console.log('[WORKER] Normal incoming message from telegram');
        this.emit('daemon:incoming:mesage', message);
    }

}

module.exports = TelegramDaemon;
