'use strict';

module.exports = function(grunt, options) {
    const buildScripts = {
        native_dev: [
            'copy:constants',
            'jshint',
            'mkdir:builds',
            'clean:builds',
            'copy:constants',
            'webpack:dev',
            'create-index',
            'cordovacli:create',
            'cordova-settings',
            'cordovacli:add_platforms',
            //'cordovacli:add_plugins',
            'clean:bin_builds_www',
            'copy:android_assets',
            'copy:compiled_sources',
            'cordovacli:build_android'
        ],
        native_prod: [
            'copy:constants',
            'jshint',
            'mkdir:builds',
            'clean:builds',
            'copy:constants',
            'webpack:prod',
            'create-index',
            'cordovacli:create',
            'cordova-settings',
            'cordovacli:add_platforms',
            //'cordovacli:add_plugins',
            'clean:bin_builds_www',
            'copy:android_assets',
            'copy:compiled_sources',
            'cordovacli:build_android'
        ],
        web_dev: [
            'copy:constants',
            'jshint',
            'mkdir:builds',
            'clean:builds',
            'copy:constants',
            'webpack:dev',
            'create-index'
        ],
        web_prod: [
            'copy:constants',
            'jshint',
            'mkdir:builds',
            'clean:builds',
            'copy:constants',
            'webpack:prod',
            'create-index'
        ]
    };

    if (options && options.args) {
        let tasks = {
            'default': ['help'],
            'web': buildScripts['web_' + options.args.mode],
            'native': buildScripts['native_' + options.args.mode]
        };

        return tasks;
    } else {
        return {
            'default': ['help']
        };
    }
};
