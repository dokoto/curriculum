'use strict';

const nopt = require('nopt');
const gruntOptions = require('grunt-known-options');
const resolve = require('resolve').sync;
const basedir = process.cwd();

class GrunterCli {
    constructor(options) {
        this.options = {};
        this.gruntpath = null;
    }

    _configureParams(params) {
        process.argv.push(sprintf('--versionApp=%s', params.versionApp));
        process.argv.push(sprintf('--mocks=%s', params.mocks));
        process.argv.push(sprintf('--verbose=%s', params.verbose));
        process.argv.push(sprintf('--mode=%s', params.mode));
        process.argv.push(sprintf('--greetings=%s', params.greetings));
        process.argv.push(params.task);
        console.debug('%s', JSON.stringify(process.argv));
    }

    _configure() {
        exports.aliases = {};
        exports.known = {};
        Object.keys(gruntOptions).forEach(function(key) {
            var short = gruntOptions[key].short;
            if (short) {
                exports.aliases[short] = '--' + key;
            }
            exports.known[key] = gruntOptions[key].type;
        });

        this.options = nopt(exports.known, exports.aliases, process.argv, 2);

        this.gruntpath = resolve('grunt', {
            'basedir': basedir
        });
    }

    run(params) {
        this._configureParams(params);
        this._configure();
        require(this.gruntpath).cli();
    }

}

module.exports = GrunterCli;
