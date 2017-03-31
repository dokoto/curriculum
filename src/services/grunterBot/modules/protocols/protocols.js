'use strict';


module.exports = {
    'start': {
        'question': 'Hola soy ManuelBot, un asistente para guiarte por el historial profesional de Manuel Alfaro Sierra, que deseas hacer ? Puedes pedir la "ayuda" en cualquie momento',
        'error': 'Disculpame soy algo joven.. No he entendio que deseas "cv", "consulta" o "ayuda" ?',
        'matcher': '\\bcv\\b|\\bconsulta\\b',
        'valueName': 'optionMenu',
        'next': 'matcher'
    },
    'ayuda': {
        'question': `Hola soy un asistente que tratar de enteder lo que me pides usando expresiones regulares. Espero crecer algun dia y
ser como mis hermanos mayores del Deep Learning. Pero por ahora estoy limitado a tratar de entender palabras dentro de lo que me escribes.
Sientete en libertad de escrir frases y disculpame si a veces no te entiendo.
Los comandos que estan siempre a tu disposicion son:
"ayuda": Siempre a tu disposicion, mostrara este mismo texto.
"cv": Te guiare para que obtengas una copia del cv de Manuel Alfaro Sierra en  pdf o en una App para android.
"consulta": Donde atraves de preguntas te dare informacion del cv de Manuel.`,
        'error': 'Que embarazoso.. no te he entendido puedes tratar de repetirlo ?',
        'matcher': '\\bcv\\b|\\bconsulta\\b|\\bdatos\\spersonales\\b|\\bskills\\b|\\beducacion\\b|\\bresumen\\sexperiencia\\b|\\bexperiencia\\sreciente\\b|\\bayuda\\b',
        'valueName': 'docType',
        'next': 'matcher'
    },
    'cv': {
        'question': 'En que formato lo quieres "apk" o "pdf" ?',
        'error': 'Disculpame soy algo joven.. No he entendio que deseas "apk", "ipa" o "pdf" ?',
        'matcher': '\\bapk\\b|\\bpdf\\b|\\bipa\\b',
        'valueName': 'docType',
        'next': 'matcher'
    },
    'pdf': {
        'question': 'Deseas que te lo envie por "email" por al "chat" ?',
        'error': 'Disculpame soy algo joven.. No he entendio que deseas "email" o "chat" ?',
        'matcher': '\\bemail\\b|\\bchat\\b',
        'valueName': 'transport',
        'next': 'matcher'
    },
    'chat': {
        'question': 'Ya esta enviado, . Te gustaria hacer algo mas ? Puesdes pedir la "ayuda" ',
        'error': 'Disculpame soy algo duro de oido.. Sino sabes que hacer pide la ayuda ?',
        'matcher': '\\bcv\\b|\\bconsulta\\b',
        'valueName': 'optionMenu',
        'triggerEvent': 'script:pdf:finish',
        'next': 'matcher'
    },
    'email': [{
        'question': 'Sin problemas, puedes darme tu email ?',
        'error': 'Disculpame soy algo joven.. Pero el email parece erroneo. Puedes escribirlo de nuevo ?',
        'matcher': '^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$',
        'valueName': 'email',
        'next': 'question'
    }, {
        'question': 'Ya esta enviado, . Te gustaria hacer algo mas ? Puesdes pedir la "ayuda" ',
        'error': 'Disculpame soy algo duro de oido.. Sino sabes que hacer pide la ayuda ?',
        'matcher': '\\bcv\\b|\\bconsulta\\b',
        'valueName': 'optionMenu',
        'triggerEvent': 'script:pdf:finish',
        'next': 'matcher'
    }],
    'ipa': [{
        'question': 'No me es posible por el momento generar IPAs para IOS. Me estoy ejecutando sobre GNU/Linux y no puedo usar el SDK de Apple.. Sorry. Quires una "apk" o "pdf" ?',
        'error': 'Disculpame soy algo joven.. No he entendio que deseas "apk" o "pdf" ?',
        'matcher': '\\bapk\\b|\\bpdf\\b',
        'valueName': 'docType',
        'next': 'matcher'
    }],
    'apk': [{
        'question': 'En modo te gustaria compilar la apk, en "release" o "debug" ?',
        'error': 'Disculpame soy algo joven.. No he entendio que deseas "release" o "debug" ?',
        'matcher': '\\brelease\\b|\\bdebug\\b',
        'valueName': 'mode',
        'next': 'question'
    }, {
        'question': 'Que version le ponemos [Formato: NNN.NNN.NNN ej: 100.0.1] ? ',
        'error': 'Disculpame soy algo joven.. No he entendio el formato, prueba con algo como 200.1.1 ?',
        'matcher': '([0-9]{1,3})\\.([0-9]{1,3})\\.([0-9]{1,3})',
        'valueName': 'versionApp',
        'next': 'question'
    }, {
        'question': 'Me gustaria dedicarte la compilacion, a que nombre quieres que apezca ? ',
        'error': 'Disculpame soy algo joven.. No uses nombres demasiados largos, maximo 100 caracteres ?',
        'matcher': '^[\\w\\s.*]{1,100}$',
        'valueName': 'greetings',
        'next': 'question',
        'triggerEvent': 'script:apk:finish'
    }, {
        'question': 'La APK se esta cocinando te enviare un enlace de descarga cuando termine. Te gustaria hacer algo mas ? Puesdes pedir la "ayuda" ',
        'error': 'Disculpame soy algo duro de oido.. Sino sabes que hacer pide la ayuda ?',
        'matcher': '\\bcv\\b|\\bconsulta\\b',
        'valueName': 'optionMenu',
        'next': 'matcher'
    }],
    'consulta': {
        'question': 'Hola, puedes consultar: "Datos personales", "skills", "educacion", "resumen experiencia", "experiencia reciente"',
        'error': 'Disculpame soy algo duro de oido.. Deseas ver mis "Datos personales", "skills", "educacion", "resumen experiencia", "experiencia reciente" o "ayuda"?',
        'matcher': '\\bdatos\\spersonales\\b|\\bskills\\b|\\beducacion\\b|\\bresumen\\sexperiencia\\b|\\bexperiencia\\sreciente\\b',
        'valueName': 'queryOption',
        'next': 'matcher'
    },
    'datos personales': {
        'question': `Manuel Alfaro Sierra
FRONTEND HYBRID DEVELOPER
Tel: 622207831 manuel.alfaro.sierra@gmail.com
https://github.com/dokoto
https://www.linkedin.com/in/manuel-alfaro-sierra-538b824b

Creativo y curioso sería la mejor forma de definir mis actitudes.
Me encanta investigar y usar las tecnologías más actuales de la forma más estable posible.
`,
        'error': 'Disculpame soy algo duro de oido.. Deseas ver mis "Datos personales", "skills", "educacion", "resumen experiencia", "experiencia reciente" o "ayuda"?',
        'matcher': '\\bdatos\\spersonales\\b|\\bskills\\b|\\beducacion\\b|\\bresumen\\sexperiencia\\b|\\bexperiencia\\sreciente\\b',
        'valueName': 'queryOption',
        'next': 'matcher'
    },
    'skills': {
        'question': `Sobre uno medida de 5:
FRONTEND
Javascript      4
JS ES6          3
HTML5           3
CSS/SASS        2

SYSTEM
NodeJS          4
Grunt           4
Cordova         4
Webpack         3
Jenkins         1
Linux           4
SVN/GIT         3

IDES
Atom            4
Android Studio  3
Xcode           3
Vim             3
Eclipse         3

LANGUAJES
English         2
`,
        'error': 'Disculpame soy algo duro de oido.. Deseas ver mis "Datos personales", "skills", "educacion", "experiencia reciente", ""experiencia reciente detallada" o "ayuda"?',
        'matcher': '\\bdatos\\spersonales\\b|\\bskills\\b|\\beducacion\\b|\\bresumen\\sexperiencia\\b|\\bexperiencia\\sreciente\\b',
        'valueName': 'queryOption',
        'next': 'matcher'
    },
    'educacion': {
        'question': `SOFTWARE ENGINEERING
Edexcel BTEC Level 5
Nota media de 7,5
`,
        'error': 'Disculpame soy algo duro de oido.. Deseas ver mis "Datos personales", "skills", "educacion", "experiencia reciente", ""experiencia reciente detallada" o "ayuda"?',
        'matcher': '\\bdatos\\spersonales\\b|\\bskills\\b|\\beducacion\\b|\\bresumen\\sexperiencia\\b|\\bexperiencia\\sreciente\\b',
        'valueName': 'queryOption',
        'next': 'matcher'
    },
    'resumen experiencia': {
        'question': `[2014 - presente]
PROGRAMER ANALYST
FRONTEND HYBRID DEV
Desarrollo de aplicaciones hibridas para tablets. Programadas con Javascript, HTML5, CSS y algo de nativo en Java y Objective-C.
Compiladas a nativo con Apache Cordova para IOS y Android.

[2005 - 2014]
TECHNICAL CONSULTAN
ABAP DEV/ANDROID NATIVE DEV
Tres años desarrollando pequeñas y medianas apps en Android nativo. Y alrededor de 9 años desarrollando soluciones sobre la plataforma SAP.
`,
        'error': 'Disculpame soy algo duro de oido.. Deseas ver mis "Datos personales", "skills", "educacion", "experiencia reciente", ""experiencia reciente detallada" o "ayuda"?',
        'matcher': '\\bdatos\\spersonales\\b|\\bskills\\b|\\beducacion\\b|\\bresumen\\sexperiencia\\b|\\bexperiencia\\sreciente\\b',
        'valueName': 'queryOption',
        'next': 'matcher'
    },
    'experiencia reciente': {
        'question': `Slideshow [ASLAM PARA PSA] Arquitecto técnico y desarrollador 10/2016-02/2017
Aplicación destinada a salones como el de Ginebra y concesionarios. Se usa para mostrar gamas de coches en alta definición en modo carrusel.
Esta aplicación web funciona como un servicio, una vez levantada se conecta a un websocket y queda a la espera del coche que se desea mostrar.
Luego desde aplicativos móviles y de PC lo usuarios envían el modelo que desea presentar en alta definición a través del canal.
- WebSockets (atmosphere)
- Javascript ES6.
- Node.js
- Webpack
- Grunt
- Babel
- Backbone.js
- Marionette 3

Constructor [ASLAM PARA PSA] Arquitecto técnico y desarrollador 10/2015-03/2016
Aplicación de construcción que se encarga de generar las releases de la App hibrida que usan los vendedores de los concesionarios del grupo PSA en 5
países (OPV TABLET). Debido a las complejas necesidades de construcción de esta App nació el requerimiento de crear una aplicación que gestionara la
construcción desde cero hasta generar una App firmada y lista para desplegar en Apple Store o Play Store.
Esta aplicación es totalmente autónoma en el caso de Android, descarga su propio SDK. También debido a las necesidades especiales de la App que
construye, en la generación se modifica el código fuente de un plugin Android usado como sustituto del webview estándar.
Esta diseñada para ser escalable y está pensada para poder compilar muchas más plataformas móviles.
- Javascript ES6.
- Node.js
- Grunt
- Apache Cordova

OPV TABLET [ASLAM PARA PSA] Desarrollador 05/2014-03/2017
Aplicación destinada a la venta de coches en los concesionarios del Grupo PSA sobre una Tablet. Actualmente desplegada sobre 5 países y con proyección de
llevarse a los 16 en los que el grupo PSA está presente. Esta app está capacitada para realizar toda la venta incluyendo la financiación. Dispone de un CRM, venta de segunda mano y parte del peritaje.
Su diseño técnico se basa en Backbone.js + Marionette + Require.js. Donde backbone + marionette estructuran la app en módulos que a su vez de dividen en
vistas, controladores y modelos. Los modelos ocultan la gestión de los datos contra los servicios rest.
La app usa grunt para construirse, ya que dependiendo de la filial a construir, Peugeot o Citroen, los fuentes tanto Javascrip como Css varían.
Este grunt genera la web app minificada. Este mismo grunt se llama desde la app Constructor como parte del proceso de construcción de la reléase nativa y firmada.
- Node.js
- Grunt
- Backbone.js
- Marionette
- Less
- Underscore
- Tpl
- Jquery
- Jquery-mobile
- Swipe
- Icroll
- moment
`,
        'error': 'Disculpame soy algo duro de oido.. Deseas ver mis "Datos personales", "skills", "educacion", "experiencia reciente", "experiencia reciente detallada" o "ayuda"?',
        'matcher': '\\bdatos\\spersonales\\b|\\bskills\\b|\\beducacion\\b|\\bresumen\\sexperiencia\\b|\\bexperiencia\\sreciente\\b',
        'valueName': 'queryOption',
        'next': 'matcher'
    }
};
