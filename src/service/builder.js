'use strict';

const nopt = require('nopt');
const gruntOptions = require('grunt-known-options');
const resolve = require('resolve').sync;
const basedir = process.cwd();

class Builder {
    constructor(options) {
        this.options = {};
        this.gruntpath = null;
        process.argv.push(sprintf('--versionApp=%s', options.versionapp));
        process.argv.push(sprintf('--mocks=%s', options.mocks));
        process.argv.push(sprintf('--verbose=%s', options.verbose));
        process.argv.push(sprintf('--mode=%s', options.mode));
        process.argv.push(options.task);
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

    run() {
        this._configure();
        require(this.gruntpath).cli();
    }

}

module.exports = Builder;
