'use strict';

const GruntServer = require('./gruntServer');
const gruntServer = new GruntServer();
require('./setGlobals').run();
gruntServer.start();
