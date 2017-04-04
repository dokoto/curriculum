'use strict';

module.exports = function(grunt, options) {
    var build_full_dev = [
        'copy:constants',
        'jshint',
        'mkdir:builds',
        'clean:builds',
        'copy:constants',
        'webpack:dev',
        'create-index'
    ];

    var build_full_prod = [
        'copy:constants',
        'jshint',
        'mkdir:builds',
        'clean:builds',
        'copy:constants',
        'webpack:prod',
        'create-index'
    ];

    function resolve(task, args) {
        let tasker = [];

        if (args.mode === 'dev') {
            tasker = build_full_dev.slice();
        } else if (args.mode === 'prod') {
            tasker = build_full_prod.slice();
        }

        return tasker;
    }


    if (options && options.args) {
        let tasks = {
            'default': ['help'],
            'web': resolve('web', options.args),
            'native': resolve('native', options.args),
        };

        return tasks;
    } else {
        return {
            'default': ['help']
        };
    }
};
