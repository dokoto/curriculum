'use strict';

const https = require('https');
const cluster = require('express-cluster');
const fs = require('fs');
const path = require('path');
const Restful = require('./restful');
const ncluster = require('cluster');
const WebSocketServer = require('./webSocketServer');

class GruntServer {
    constructor() {
        this.restful = new Restful();
        this._options = {};
        this.ws = new WebSocketServer();
    }

    _handleHttpServer() {
        console.printf('Service listening connections at https://%s:%s with pid: ', '127.0.0.1', '8080', process.pid);
    }

    _handleCluster() {
        https.createServer(this._options, this.restful.app).listen(8080, this._handleHttpServer.bind(this));
    }

    _masterProcess() {
        this.ws.start();
    }

    _setOptions() {
        if (ncluster.isMaster) {
            console.printf('ALERTA !!! HAY QUE REGENERAR LAS KEYS');
            this._masterProcess();
        }
        this._options.key = fs.readFileSync(path.join(process.cwd(), 'src/service/config/certs/key.pem'));
        this._options.cert = fs.readFileSync(path.join(process.cwd(), 'src/service/config/certs/cert.pem'));
    }

    start() {
        this._setOptions();
        cluster(this._handleCluster.bind(this));
    }
}

module.exports = GruntServer;
