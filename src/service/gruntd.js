'use strict';



const nopt = require('nopt');
const gruntOptions = require('grunt-known-options');
const resolve = require('resolve').sync;
const basedir = process.cwd();

process.argv.push('--versionApp=999.999.1');
process.argv.push('--mocks=false');
process.argv.push('--verbose=true');
process.argv.push('--mode=dev');
process.argv.push('build-web');

exports.aliases = {};
exports.known = {};
Object.keys(gruntOptions).forEach(function(key) {
    var short = gruntOptions[key].short;
    if (short) {
        exports.aliases[short] = '--' + key;
    }
    exports.known[key] = gruntOptions[key].type;
});

let options = nopt(exports.known, exports.aliases, process.argv, 2);

let gruntpath = resolve('grunt', {
    'basedir': basedir
});

require(gruntpath).cli();
