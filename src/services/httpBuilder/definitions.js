'use strict';

const express = require('express');
const services = require('./services');
const router = express.Router();

router.use('/api/v1/', services);

module.exports = router;
