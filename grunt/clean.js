'use strict';

module.exports = function(grunt, options) {


    return {
        web_builds: {
            src: ['builds/core/<%=args.mode%>/*', 'builds/maven/<%=args.mode%>/*']
        },
        bem_components: {
            src: ['src/components/*']
        },
        materialize_bem: {
            src: ['src/css/bem/vendor/materialize/*']
        },
        factory_reset: {
            src:['src/css/bem/vendor/*', 'src/js/helpers/components/*', '../node_modules']
        }
    };
};
