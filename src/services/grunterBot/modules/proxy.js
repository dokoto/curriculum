'use strict';

const COMMANDS = require('../config/commands');

class Proxy {
    constructor(bot, message) {
        this.bot = bot;
        this.message = message;
    }

    _informBadMessageFormat(err) {
        this.bot.sendMessage({
            chat_id: this.message.from.id,
            text: err.message
        });
    }

    _sendHelp() {
        this.bot.sendMessage({
            chat_id: this.message.from.id,
            text: COMMANDS.HELP
        });
    }

    _hello() {
        this.bot.sendMessage({
            chat_id: this.message.from.id,
            text: 'I\'m ready master !'
        });
    }

    _selectModule(action, path, argv, allowArgv) {
        const Component = require(path);
        new Component(this.bot, this.message.from.id, argv, allowArgv).run();
    }

    _executeCommand() {
        let command = {};
        let splited = this.message.text.split(' ');
        if (splited.length > 0) {
            try {
                command.action = splited[0];
                if (!COMMANDS.ACTIONS[command.action]) throw new Error('COMMAND_NOT_FOUND');
                command.args = splited.slice(1);
                this[COMMANDS.ACTIONS[command.action].method].call(this,
                    command.action, COMMANDS.ACTIONS[command.action].path, command.args, COMMANDS.ACTIONS[command.action].argv);
            } catch (err) {
                console.error('[PROXY] %s', err.message);
                throw new Error(err.message);
            }
        } else {
            throw new Error('BAD_MESSSAGE_FORMAT');
        }
    }

    run() {
        try {
            this._executeCommand();
        } catch (err) {
            this._informBadMessageFormat(err);
        }
    }
}


module.exports = Proxy;
