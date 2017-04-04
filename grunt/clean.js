'use strict';

module.exports = function(grunt, options) {
    return {
        builds: {
            src: ['builds/web/<%=args.mode%>/*', 'builds/native/<%=args.mode%>/*']
        }
    };
};
