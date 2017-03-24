'use strict';

const util = require('util');
const consts = require('../../grunt/config/constants');
const clc = require('cli-color');

class SetGlobals {
    static run() {
        SetGlobals._setGlobalNameSpace();
        SetGlobals._overWriteConsole();
    }

    static _overWriteConsole() {
        console.debug = SetGlobals._consoleDebug;
        console.printf = SetGlobals._consoleLog;
        console.error = SetGlobals._consoleError;
        console.warn = SetGlobals._consoleWarn;
    }

    static _consoleDebug(msg, ...args) {
        if (process.argv.indexOf('--verbose') !== -1) {
            let header = util.format(clc.magenta('[%s] '), consts.APP_NAME);
            console.log(util.format.apply(this, [].concat(header + msg, args)));
        }
    }

    static _consoleLog(msg, ...args) {
        let header = util.format(clc.blue('[%s] '), consts.APP_NAME);
        console.log(util.format.apply(this, [].concat(header + msg, args)));
    }

    static _consoleError(msg, ...args) {
        let header = util.format(clc.red('[%s] '), consts.APP_NAME);
        console.log(util.format.apply(this, [].concat(header + msg, args)));
    }

    static _consoleWarn(msg, ...args) {
        let header = util.format(clc.yellow('[%s] '), consts.APP_NAME);
        console.log(util.format.apply(this, [].concat(header + msg, args)));
    }

    static _setGlobalNameSpace() {
        global.APP = {};
        global.sprintf = util.format;
    }
}

module.exports = SetGlobals;
