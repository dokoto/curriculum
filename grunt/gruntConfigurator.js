'use strict';

var exports = module.exports = {};

var path = require('path');
var utils = {
    misc: require('./utils/misc')
};

class Configurator {

    constructor(grunt, jsonConfigFile) {
        this.jsonConfigFile = jsonConfigFile;
        this.data = require(jsonConfigFile);
        this.grunt = grunt;
    }

    explore(ptr, args) {
        if (args.length === 1) {
            if (ptr[args[0]] === undefined) {
                return {
                    value: null,
                    error: true,
                    fieldError: args[0]
                };
            } else {
                return {
                    value: ptr[args[0]],
                    error: false,
                    fieldError: null
                };
            }
        } else {
            if (ptr[args[0]] === undefined) {
                return {
                    value: null,
                    error: true,
                    fieldError: args[0]
                };
            }
            var newPtr = ptr[args[0]];
            args = args.splice(1);
            return this.explore(newPtr, args);
        }
    }

    fetch(args) {
        if (!args) {
            return this.data;
        }
        var params = args.slice(0);
        var result = this.explore(this.data, params);
        if (result.error === true) {
            var literal = '';
            for (var arg in args) {
                literal += '[' + args[arg] + ']';
            }
            console.error('Field: "' + result.fieldError + '" not found as : confEnv' + literal + '. Check your json config file "' + this.jsonConfigFile + '"');
            this.grunt.fail.fatal("FATAL ERROR");
        } else {
            return result.value;
        }
    }
}

var doMap = {
    mkConf: function(grunt) {
        return {
            base: new Configurator(grunt, './config/constants.json'),
            cordova: new Configurator(grunt, './config/build_cordova_conf_base.json'),
        };
    },

    global: function(grunt) {
        var data = {};

        return data;
    },

    args: function(grunt, data) {
        const packageApp = grunt.file.readJSON('package.json');
        const validParams = require('./config/valid_values.json');

        data.baseDir = process.cwd();
        data.pkg = packageApp;

        data.args = {};
        if (grunt.option('versionApp') === undefined) {
            grunt.fail.fatal('El parametro --versionApp es obliglatorio para el constructor');
        } else {
            data.args.versionApp = grunt.option('versionApp');
        }

        if (grunt.option('mode') === undefined) {
            grunt.fail.fatal('El parametro --mode es obliglatorio para el constructor');
        } else {
            data.args.mode = (grunt.option('mode') || 'dev').toLowerCase();
            if (validParams.args.mode.indexOf(data.args.mode) === -1) {
                grunt.fail.fatal('El parametro --mode solo puede contener los valores: ' + validParams.args.mode);
            }
        }

        data.args.os = (grunt.option('os') || 'android').toLowerCase();
        if (validParams.args.os.indexOf(data.args.os) === -1) {
            grunt.fail.fatal('El parametro --os=' + data.args.os + ' solo puede contener los valores: ' + validParams.args.os);
        }

        data.args.lang = (grunt.option('lang') || 'es').toLowerCase();
        if (validParams.args.lang.indexOf(data.args.lang) === -1) {
            grunt.fail.fatal('El parametro --lang=' + data.args.lang + ' solo puede contener los valores: ' + validParams.args.lang);
        }
        data.args.mocks = utils.misc.convBoolean(grunt.option, 'mocks', false);
        data.args.greetings = (grunt.option('greetings') || 'Gracias por tu interes :)');
        data.args.verbose = utils.misc.convBoolean(grunt.option, 'verbose', false);

        data.args.build_date = new Date().toISOString();
        data.args.target = grunt.cli.tasks[0].substr(grunt.cli.tasks[0].indexOf('-') + 1);

        return data;
    },

    base: function(grunt, conf, data) {
        data.base = {};

        data.base.appName = conf.base.fetch(['APP_NAME']);
        data.base.buildFolder = conf.base.fetch(['BUILD_FOLDER']);
        data.base.sourcesFolder = conf.base.fetch(['SOURCES_FOLDER']);
        data.base.proyectFolderName = __dirname.substr(__dirname.lastIndexOf(path.sep) + 1);

        return data;
    },

    git: function(grunt, conf, data) {
        data.git = conf.git.data;

        return data;
    },

    cordova(grunt, conf, data) {
        data.cordova = {};

        data.cordova = conf.cordova.fetch();
        data.cordova.configXmlPath = path.join('assets/cons', data.cordova.configFile);
        data.cordova.configXmlActions = require('./config/build_cordova_config_xml.json');

        return data;
    },


};

function header(grunt, data) {
    grunt.log.writeln('*********************************************************************');
    grunt.log.writeln('CV Constructor System... ' + data.pkg.version + 'v');
    grunt.log.writeln('*********************************************************************');
    grunt.log.writeln('Project           : ' + data.args.target);
    grunt.log.writeln('App version       : ' + data.args.versionApp);
    grunt.log.writeln('Compilation Mode  : ' + data.args.mode);
    grunt.log.writeln('Native OS target  : ' + data.args.os);
    grunt.log.writeln('Mock actived      : ' + data.args.mocks);
    grunt.log.writeln('Build Date        : ' + data.args.build_date);
    grunt.log.writeln('Verbose           : ' + data.args.verbose);
    grunt.log.writeln('Greetings         : ' + data.args.greetings);
    grunt.log.writeln('Languaje          : ' + data.args.lang);
    grunt.log.writeln('**********************************************************************');
}

function mainProcess(grunt, data) {
    // CONFIG FILES
    var conf = doMap.mkConf(grunt);

    // ARGUMENTS
    data = doMap.args(grunt, data);

    // BASE
    data = doMap.base(grunt, conf, data);

    // CORDOVA
    data = doMap.cordova(grunt, conf, data);

    // Header
    header(grunt, data);

    return data;
}

exports.doMap = function(grunt) {

    // GLOBAL
    var data = doMap.global(grunt);
    if (process.argv.length === 2) {
        data.args = {};
    } else if (process.argv.length > 2) {
        data = mainProcess(grunt, data);
    }

    return data;
};
