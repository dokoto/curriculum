'use strict';

const I18n = require('i18n-browser');
const vsprintf = require("sprintf-js").vsprintf;

class Locale {
    constructor(options) {
        this.options = options;
        this.browserLocale = this._getBrowserLocale();
        this.opvDefaultLocale = this._getOPVDefaultLocale();
        this.i18nLocale = this._getI18nLocale();
        this._setDefaultLocale();
    }

    _getOPVDefaultLocale() {
        return this.options.language.toLowerCase() + '_' + this.options.country.toUpperCase() +
            '_' + this.options.brand.toUpperCase();
    }

    _getBrowserLocale() {
        return window.navigator.language || window.navigator.userLanguage || null;
    }

    _getI18nLocale() {
        return this.options.language.toLowerCase() + '_' +
            this.options.country.toLowerCase();
    }

    _setGlobali18n(json) {
        APP.i18n = new I18n(json);
        window.i18n = (key, ...args) => {
            let translation = APP.i18n.__(key);
            if ( typeof translation === 'string') {
                translation = vsprintf(translation, args);
                return (typeof translation === 'object') ? key : translation;
            } else {
                console.error('[LOCALE] Label %s not found', key);
                return key;
            }
        };
    }

    _setDefaultLocale() {
        console.log('[UTILS.LOCALE] Setting default locale %s', this.i18nLocale);
        try {
            this._setGlobali18n(require('json!assets/localization/' + this.i18nLocale + '.json'));
        } catch (error) {
            console.log('[UTILS.LOCALE] Default locale %s not found. Setting en_gb', this.i18nLocale);
            this._setGlobali18n(require('json!assets/localization/en_gb.json'));
        }
    }

    setLocaleFromRest() {
        try {
            const Messages = require('js/models/messages');
            let messages = new Messages();
            messages.on('sync', this._messagesFetchOk.bind(this));
            messages.on('error', this._messagesFetchError.bind(this));
            messages.obtain({
                data: {
                    'startsWith': 'label.slideshow'
                },
                type: 'GET'
            });
        } catch (error) {
            console.log('[UTILS.LOCALE] Default locale %s not found. Setting en_gb', this.i18nLocale);
        }
    }

    _messagesFetchOk(messages, response, xhr) {
        console.log('[UTILS.LOCALE] Fetched messages model %o', messages);
        if (!response.error) {
            let traductions = messages.toJSON();
            traductions = Object.keys(traductions).map((key => traductions[key])).reduce((prev, next, index) =>  (index === 1) ? {[prev.label]: prev.value, [next.label]: next.value} : Object.assign(prev, {[next.label]: next.value}));
            this._setGlobali18n(traductions);
        } else {
            this._messagesFetchError(response.error);
        }
    }

    _messagesFetchError(error) {
        console.error('[UTILS.LOCALE] Error fetching locales from Rest %o', error);
    }
}

module.exports = Locale;
