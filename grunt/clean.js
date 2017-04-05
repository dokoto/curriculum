'use strict';

module.exports = function(grunt, options) {
    return {
        builds: {
            src: ['builds/web/<%=args.mode%>/*', 'builds/native/<%=args.mode%>/*']
        },
        bin_builds_www: {
            src: ['builds/native/<%=args.mode%>/<%=pkg.name%>/www/*']
        }
    };
};
