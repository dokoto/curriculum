'use strict';

/*
 * Vex Docs http://github.hubspot.com/vex/api/basic/
 */
const vex = require('vex-js/src/vex');
require('vex-js/dist/css/vex.css');
require('vex-js/dist/css/vex-theme-wireframe.css');

class Popup {
    constructor() {
        vex.registerPlugin(require('vex-dialog/src/vex.dialog'));
        vex.defaultOptions.className = 'vex-theme-wireframe';
    }

    /*
     * vex.dialog.alert('Thanks for checking out vex!')
     * // This use of raw HTML is made safe because the HTML is static.
     * vex.dialog.alert({ unsafeMessage: '<b>Hello World!</b>' })
     * // This use of raw HTML is made safe because the Underscore escape method is used to escape potentially unsafe content.
     * vex.dialog.alert({ unsafeMessage: '<b>Hello ' + _.escape(user.firstName) + '!</b>' })
     */
    alert(stringOptions) {
        vex.dialog.alert(stringOptions);
    }

    /*
     * vex.dialog.confirm({
     *  message: 'Are you absolutely sure you want to destroy the alien planet?',
     *  callback: function (value) {
     *      console.log(value)
     *  }
     * })
     */
    confirm(options) {
        options.buttons = [
            $.extend({}, vex.dialog.buttons.YES, {
                text: i18n('label.slideshow.popup.yes')
            }),
            $.extend({}, vex.dialog.buttons.NO, {
                text: i18n('label.slideshow.popup.no')
            })
        ];
        vex.dialog.confirm(options);
    }

    /*
     * vex.dialog.prompt({
     *  message: 'What planet did the aliens come from?',
     *  placeholder: 'Planet name',
     *  callback: function (value) {
     *      console.log(value)
     *  }
     * })
     */
    prompt(options) {
        vex.dialog.prompt(options);
    }

    /*
     * With open, you are in full control.
     */
    open(options) {
        vex.dialog.open(options);
    }
}

module.exports = Popup;
