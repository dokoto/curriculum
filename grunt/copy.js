
'use strict';

module.exports = function(grunt, options) {

    return {
        materialize_bem: {
            files: [{
                expand: true,
                cwd: 'node_modules/materialize-css/',
                src: ['fonts/roboto/**/*', 'sass/components/**/*'],
                dest: 'src/css/bem/vendor/materialize/'
            }]
        },
        constants: {
            files: [{
                expand: true,
                cwd: __dirname + '/config/',
                src: ['constants.json'],
                dest: 'src/assets/config/'
            }],
            options: {
                process: function(content, srcpath) {
                    try {
                        const path = require('path');
                        let constsToModify = require(srcpath);
                        let builtConsts = {};
                        for (let key in constsToModify) {
                            if (options.args[key.toLowerCase()] !== undefined) {
                                builtConsts[key] = options.args[key.toLowerCase()];
                            } else {
                                builtConsts[key] = constsToModify[key];
                            }
                        }
                        return JSON.stringify(builtConsts);
                    } catch (error) {
                        grunt.log.error(error);
                        return content;
                    }
                }
            }
        },
        maven: {
            files: [{
                expand: true,
                cwd: 'builds/core/<%=args.mode%>/',
                src: ['**/*'],
                dest: 'builds/maven/<%=args.mode%>/main/webapp/'
            }]
        }
    };
};
