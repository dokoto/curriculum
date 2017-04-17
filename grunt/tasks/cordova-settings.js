'use strict';

module.exports = function(grunt) {
    const path = require('path');
    const CordorvaConfTool = require('../utils/cordovaConfTool');

    let options = grunt.config.data;
    grunt.registerTask('cordova-settings', function() {
        let options = grunt.config.data;
        let origin = path.join(options.baseDir, 'builds/native/', options.args.mode, options.pkg.name, options.cordova.configFile);
        let confTool = new CordorvaConfTool(grunt, origin, options.cordova.configXmlActions);
        confTool.run(confTool);
    });
};
