'use strict';

module.exports = function(grunt, options) {
    var build_full_dev = [
        'websocket-server',
        'clean:bem_components',
        'clean:materialize_bem',
        'copy:materialize_bem',
        'copy:constants',
        'concat:bem_components',
        'jshint',
        'mkdir:builds',
        'clean:web_builds',
        'mkdir:indexes',
        'create-indexes',
        'webpack:dev'
    ];

    var build_full_prod = [
        'websocket-server',
        'clean:bem_components',
        'clean:materialize_bem',
        'copy:materialize_bem',
        'copy:constants',
        'concat:bem_components',
        'jshint',
        'mkdir:builds',
        'clean:web_builds',
        'mkdir:indexes',
        'create-indexes',
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
            'build-core': resolve('build-core', options.args),
            'build-maven': resolve('build-maven', options.args),
        };

        return tasks;
    } else {
        return {
            'default': ['help']
        };
    }
};
