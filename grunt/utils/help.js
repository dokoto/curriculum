'use strict';

module.exports = function (grunt, options) {
  grunt.registerTask('help', function () {

    grunt.log.writeln('Use : #> grunt [options] [task]');
    grunt.log.writeln('Ej: #> grunt --mode=dev --websocketserver=down --versionApp=0.0.1 fake-task');
    grunt.log.writeln('Debug Win+nvm Ej: #> node-debug C:\\Users\\USER\\AppData\\Roaming\\nvm\\v5.5.0\\node_modules\\grunt-cli\\bin\\grunt --mode=dev --env=pre --websocketserver=down --versionApp=0.0.1 build');
    grunt.log.writeln('Debug Win Ej: #> node-debug C:\\Users\\USER\\AppData\\Roaming\\npm\\node_modules\\grunt-cli\\bin\\grunt --mode=dev --env=pre --websocketserver=down --versionApp=0.0.1 build');
    grunt.log.writeln('Debug Win Ej: #> %gruntd% --mode=dev --env=pre --websocketserver=down --versionApp=0.0.1 build');

    grunt.log.writeln(' ');
    grunt.log.writeln('[Opciones *:parametro obligatorio] >');
    grunt.log.writeln('Los parametros son obligatorios en todas las tareas porque es lo que le indica al constructor sobre que build/[gotchi_XX_XX_XXX] trabajar');
    grunt.log.writeln('*versionApp     : Version a generar ej: --versionApp=287.3.3');
    grunt.log.writeln('*mode           : Tipo de compilacion ej: --mode=[dev(por defecto)|prod]');
    grunt.log.writeln('*env            : Tipo de compilacion ej: --env=[pre(por defecto)|loc|dev|pre|prod]');
    grunt.log.writeln('verbose         : Log ampliado ej: --verbose=[false(por defecto)|true]');

    grunt.log.writeln(' ');
    grunt.log.writeln('[Opciones para DESARROLLO] >');
    grunt.log.writeln('*mocks          : Activa los mocks o objetos simulados ej: --mocks=[false: sin mocks(por defecto), true: con mocks]');
    grunt.log.writeln('websocketserver : Activa un servidor de webSockets ej: --websocketserver=[up: servidor conectado, down: servidor apagado(por defecto)]');
    grunt.log.writeln('*websockettype  : Define el tipo de cliente a usar con el websocket ej: --websockettype=[js: JS estandar(si no lo indicamos y websocketserver=up), at_ws: webSockets atmosphere], at_lp: long-polling atmosphere');

    grunt.log.writeln(' ');
    grunt.log.writeln('[Lista de tareas] >');
    grunt.log.writeln('default         : Muestra esta ayuda');

    grunt.log.writeln(' ');
    grunt.log.writeln('[CONSTRUCCION] >');
    grunt.log.writeln('build-core       : Crea la app o la actualiza".');
    grunt.log.writeln('build-maven      : Crea la app o la actualiza y genera una estructura para desplegar en Maven".');
  });
};
