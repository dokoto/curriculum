'use strict';

const readline = require('readline');
const Engine = require('./engine');

class Test {
    static run() {
        // TEST
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const engine = new Engine();

        function _handleResponse(response) {
            engine.next(response);
        }

        function _handleQuestionReady(question) {
            rl.question(question + ' > ', _handleResponse.bind());
        }


        function _handleFinishApk(values) {
            console.log('finish apk %s', JSON.stringify(values));
        }

        function _handleFinishPdf(values) {
            console.log('finish pdf %s', JSON.stringify(values));
        }


        engine.on('script:question:ready', _handleQuestionReady);
        engine.on('script:apk:finish', _handleFinishApk);
        engine.on('script:pdf:finish', _handleFinishPdf);
        engine.start();

    }
}

Test.run();
