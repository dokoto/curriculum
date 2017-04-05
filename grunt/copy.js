'use strict';

module.exports = function(grunt, options) {

    return {
        compiled_sources: {
            files: [{
                expand: true,
                cwd: 'builds/web/<%=args.mode%>/',
                src: ['**/*'],
                dest: 'builds/native/<%=args.mode%>/<%=pkg.name%>/www/'
            }]
        },
        android_assets: {
            files: [{
                expand: true,
                cwd: 'grunt/assets/<%=args.os%>/icons/',
                src: ['**/*'],
                dest: 'builds/native/<%=args.mode%>/<%=pkg.name%>/platforms/<%=args.os%>/res/'
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
                            } else if (options.base[key.toLowerCase()] !== undefined) {
                                builtConsts[key] = options.base[key.toLowerCase()];
                            } else {
                                builtConsts[key] = constsToModify[key];
                            }
                        }
                        //grunt.log.writeln(JSON.stringify(builtConsts));
                        return JSON.stringify(builtConsts);
                    } catch (error) {
                        grunt.log.error(error);
                        return content;
                    }
                }
            }
        }
    };
};
