'use strict';

module.exports = function(grunt, options) {
    grunt.registerTask('help', function() {

        grunt.log.writeln('Use : #> grunt [options] [task]');
        grunt.log.writeln('Ej: #> grunt --mode=dev --versionApp=0.0.1 [task name]');
        grunt.log.writeln('Debug Win Ej: #> %gruntd% --mode=dev --versionApp=0.0.1 build-web');

        grunt.log.writeln(' ');
        grunt.log.writeln('[Opciones *:parametro obligatorio] >');
        grunt.log.writeln('*versionApp     : Version a generar ej: --versionApp=0.3.3');
        grunt.log.writeln('*mode           : Tipo de compilacion ej: --mode=[dev(por defecto)|prod]');
        grunt.log.writeln('verbose         : Log ampliado ej: --verbose=[false(por defecto)|true]');

        grunt.log.writeln(' ');
        grunt.log.writeln('[Opciones para DESARROLLO] >');
        grunt.log.writeln('*mocks          : Activa los mocks o objetos simulados ej: --mocks=[false: sin mocks(por defecto), true: con mocks]');

        grunt.log.writeln(' ');
        grunt.log.writeln('[Lista de tareas] >');
        grunt.log.writeln('default         : Muestra esta ayuda');

        grunt.log.writeln(' ');
        grunt.log.writeln('[CONSTRUCCION] >');
        grunt.log.writeln('build-web       : Crea la web app".');
        grunt.log.writeln('build-native    : Crea la app nativa firmada".');
    });
};
