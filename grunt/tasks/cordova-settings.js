'use strict';

module.exports = function(grunt) {
    const path = require('path');
    const CordorvaConfTool = require('../utils/cordovaConfTool');

    let options = grunt.config.data;
    let origin = path.join(options.baseDir, 'builds/native/', options.args.mode, options.pkg.name, options.cordova.configFile);
    let confTool = new CordorvaConfTool(grunt, origin, options.cordova.configXmlActions);
    grunt.registerTask('cordova-settings', confTool.run.bind(confTool));
};
