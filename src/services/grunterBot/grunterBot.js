'use strict';

const os = require('os');
const SetGlobals = require('./utils/setGlobals');
const TelegramDaemon = require('./modules/telegramAPI/telegramDaemon');
const ProxyModule = require('./modules/proxy');
const cluster = require('cluster');
const CpuUsage = require('./utils/cpuUsage');

class GrunterBot {
    constructor() {
        SetGlobals.run();
    }

    _handleTelegramIncomingMsg(message) {
        new ProxyModule(this.telegramBot, message).run();
    }

    _starTelegramDaemon() {
        this.telegramBot.on('daemon:incoming:mesage', this._handleTelegramIncomingMsg.bind(this));
        this.telegramBot.start();
    }

    _handleClusterExit(worker, code, signal) {
        console.log('[WORKER] %s died, %s %s', worker.process.pid, code, signal);
        if (!worker.exitedAfterDisconnect) {
            cluster.fork();
        }
    }

    _startClusterMode() {
        if (cluster.isMaster) {
            let cpus = os.cpus();
            console.log('[MASTER] %s is running', process.pid);
            for (let cpu in cpus) cluster.fork();
            APP.cpuUsage = new CpuUsage();
            APP.cpuUsage.start();
            this._starTelegramDaemon();
            cluster.on('exit', this._handleClusterExit.bind(this));
        } else if (cluster.isWorker) {
            console.log('[WORKER] %s is running', process.pid);
            cluster.worker.process.on('message', this._handleTelegramIncomingMsg.bind(this));
        }
    }

    run() {
        this._startClusterMode();
    }

}


new GrunterBot().run();
