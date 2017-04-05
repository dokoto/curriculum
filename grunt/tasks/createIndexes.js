'use strict';

module.exports = function(grunt) {
    const fs = require('fs');
    const path = require('path');
    const _ = require('underscore');
    const constants = require('../config/constants');

    let options = grunt.config.data;
    grunt.registerTask('create-index', function() {
        let pathfolder = path.join(process.cwd(), 'builds/web', options.args.mode);
        const indexTpl = fs.readFileSync(path.join(process.cwd(), 'grunt/templates/index.html'), {
            encoding: 'utf8'
        });

        grunt.log.writeln('==> Creating index html on ' + pathfolder);
        let compiled = _.template(indexTpl);
        let transformed = compiled({
            'title': constants.APP_DESCRIPTION,
            'env': options.args.mode,
            'language': options.args.lang,
            'bootFile': options.base.appName
        });
        fs.writeFileSync(path.join(pathfolder, 'index.html'), transformed);
    });

};
