'use strict';

module.exports = {
    convBoolean: function(options, key, defaultValue) {
        if (typeof options(key) === 'boolean') {
            return options(key);
        } else {
            var stringBoolean = options(key);
            if (stringBoolean) {
                if (stringBoolean === 'true') {
                    return true;
                } else if (stringBoolean === 'false') {
                    return false;
                } else {
                    return defaultValue;
                }
            } else {
                return defaultValue;
            }
        }
    },
    resolveComplexVal: function(grunt, options, funcNode) {
        try {

            if (grunt === undefined) {
                throw 'grunt is undefined';
            }

            if (options === undefined) {
                throw 'options is undefined';
            }

            if (funcNode === undefined) {
                throw 'funcNode is undefined';
            }

            if (typeof funcNode === 'string') {
                return funcNode;
            } else if (typeof funcNode === 'object') {
                var dFunc, i;
                var funcDeps = [grunt, options];
                var funcDepsTxt = ['grunt', 'options'];

                for (i = 0; i < funcNode.nodeLibs.length; i++) {
                    funcDeps.push(require(funcNode.nodeLibs[i]));
                    funcDepsTxt.push(funcNode.nodeLibs[i]);
                }
                funcDepsTxt.push(funcNode.code);
                try {
                    dFunc = Function.apply(null, funcDepsTxt);
                    let result = dFunc.apply(null, funcDeps);
                    return result;
                } catch(error) {
                    grunt.fatal(error);
                }
            }
        } catch (error) {
            grunt.fatal(error);
        }
    },
};
