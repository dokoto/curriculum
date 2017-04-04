'use strict';

module.exports = {
    initialize: (options) => {
        console.log('[ROUTER] initialization');
    },
    chat: () => {},
    greetings: () => {},
    regions: {
        appRegion: '#app-region',
        settingsRegion: '#settings-region',
        headerRegion: '#header-region',
        mainRegion: '#main-region',
        dialogRegion: '#dialog-region',
        bpopupRegion: '#bpopup-region'
    }
};
