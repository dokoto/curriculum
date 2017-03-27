'use strict';

const WSServer = require('websocket').server;
const http = require('http');
const port = 8001;
const protocol = 'chat';
var clients = {};

class WebSocketServer {
    constructor() {
        this.server = null;
        this.webSocketServer = null;
    }

    _createServerHandler(request, response) {
        console.printf(Date.now() + ' Received request for ' + request.url);
        response.writeHead(404);
        response.end();
    }

    _requestHandler(request) {
        if (!this._originIsAllowed(request.origin)) {
            // Make sure we only accept requests from an allowed origin
            request.reject();
            console.printf('[%d] Connection from origin %s rejected.', Date.now(), request.origin);
            return;
        }

        try {
            var connection = request.accept(protocol, request.origin);
            connection.id = request.httpRequest.headers['sec-websocket-key'];
            console.printf('[%d] Connection accepted from %s/%s %s ', Date.now(), connection.remoteAddress, request.resource, connection.id);
            clients[connection.id] = connection;

            connection.on('message', function(message) {
                if (message.type === 'utf8') {
                    console.printf('[%d] Received UTF8 Message: %s', Date.now(), message.utf8Data);
                    /*
                    if (responseJSON[message.utf8Data]) {
                        for (let id in clients) {
                            clients[id].sendUTF(JSON.stringify(responseJSON[message.utf8Data]));
                        }
                    } else {
                        console.printf('[%d] No id: %s found', Date.now(), message.utf8Data);
                    }*/
                } else if (message.type === 'binary') {
                    console.printf('[%d] Received Binary Message of %s bytes', Date.now(), message.binaryData.length);
                    console.warn('[%d] NO Binary response definided', Date.now());
                }
            });

            connection.on('close', function(reasonCode, description) {
                delete clients[this.id];
                console.printf('[%d] Peer %s %s disconnected.', Date.now(), this.remoteAddress, this.id);
            });

        } catch (e) {
            console.error('[%d] ERROR : %s', Date.now(), e.message);
        }
    }

    _serverListenHandler() {
        console.printf('[%d] Server is listening on http://127.0.0.1:%d', Date.now(), port);
    }

    _originIsAllowed(origin) {
        // put logic here to detect whether the specified origin is allowed.
        return true;
    }

    start() {
        this.server = http.createServer(this._createServerHandler.bind(this));
        this.server.listen(port, this._serverListenHandler.bind(this));
        this.webSocketServer = new WSServer({
            httpServer: this.server,
            autoAcceptConnections: false
        });
        this.webSocketServer.on('request', this._requestHandler.bind(this));
    }

}

module.exports = WebSocketServer;
