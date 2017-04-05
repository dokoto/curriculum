'use strict';

module.exports = function(grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-config')(grunt, {
        data: require('./grunt/gruntConfigurator.js').doMap(grunt),
        init: true,
        loadGruntTasks: {
            config: require('./package.json'),
            scope: 'devDependencies',
            pattern: 'grunt-*'
        }
    });

    grunt.loadTasks('grunt/tasks');
};
