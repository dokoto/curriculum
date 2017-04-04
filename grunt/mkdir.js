'use strict';

module.exports = function(grunt, options) {

    return {
        builds: {
            options: {
                create: ['builds/web/dev', 'builds/web/prod', 'builds/native/dev', 'builds/native/prod']
            }
        }
    };
};
