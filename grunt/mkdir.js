'use strict';

module.exports = function(grunt, options) {

    return {
        builds: {
            options: {
                create: ['builds/core/dev', 'builds/core/prod']
            }
        },
        indexes: (function() {
            if (!options.args.mode) {
                return;
            }
            const countries = require(process.cwd() + '/src/assets/config/url_env.json');
            const path = require('path');

            let folders = {
                options: {
                    create: []
                }
            };

            let pathforlder = path.join('builds/core', options.args.mode);
            for (let country in countries) {
                for (let brand in countries[country]) {
                    if (countries[country][brand].active) {
                        folders.options.create.push(path.join(pathforlder, country, brand));
                    }
                }
            }

            return folders;
        })()
    };
};
