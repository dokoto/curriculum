'use strict';

const TelegramBot = require('node-telegram-bot');
const TELEGRAM_CONST = require('../../config/telegramAPI');
const EventEmitter = require('events');
const cluster = require('cluster');

class TelegramDaemon extends EventEmitter {
    constructor() {
        super();
        this.telegramBot = new TelegramBot({
            token: TELEGRAM_CONST.TOKEN
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
        if (cluster.isMaster) {
            console.debug('[TELEGRAM-DAEMON][MASTER] incoming message %s from telegram', message);
            const worker = APP.cpuUsage.getLowerLoadWorker();
            console.printf('[TELEGRAM-DAEMON][MASTER] Assigned to %s cpu load at %s', worker.process.pid, worker.stat.cpu);
            worker.process.send(message);
        } else {
            console.log('[WORKER] Normal incoming message from telegram');
            this.emit('daemon:incoming:mesage', message);
        }
    }

}

module.exports = TelegramDaemon;
