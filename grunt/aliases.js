'use strict';

module.exports = function(grunt, options) {
    var build_full_dev = [
        'copy:constants',
        'jshint',
        'mkdir:builds',
        'clean:web_builds',
        'webpack:dev'
    ];

    var build_full_prod = [
        'copy:constants',
        'jshint',
        'mkdir:builds',
        'clean:web_builds',
        'webpack:prod'
    ];


    function resolve(task, args) {
        let tasker = [];

        if (args.mode === 'dev') {
            tasker = build_full_dev.slice();
        } else if (args.mode === 'prod') {
            tasker = build_full_prod.slice();
        }
        switch (task) {
            case 'build-maven':
                tasker.push('copy:maven');
                break;
        }

        return tasker;
    }


    if (options && options.args) {
        let tasks = {
            'default': ['help'],
            'build-web': resolve('build-web', options.args),
            'build-native': resolve('build-native', options.args),
        };

        return tasks;
    } else {
        return {
            'default': ['help']
        };
    }
};
