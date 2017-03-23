'use strict';

class MockPool {
    static get() {
        console.log('[MOCKPOOL] Activing mocks...');
        let mocks = require.context('./definitions', false, /js$/);
        let mocksActive = [];
        for(let i = 0; i < mocks.keys().length; i++) {
            let mocksTmp = require('./definitions/' + mocks.keys()[i].substr(2));
            for(let y = 0; y < mocksTmp.length; y++) {
                if (mocksTmp[y].active) {
                    console.log('[MOCKPOOL] Mock %s METHOD %s ACTIVATED', mocks.keys()[i].substr(2), mocksTmp[y].method);
                    mocksActive.push(mocksTmp[y]);
                }
            }
        }
        return mocksActive;
    }
}

module.exports = MockPool;
