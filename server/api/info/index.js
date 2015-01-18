/**
 * Created by Leo on 18/01/2015.
 */
'use strict';

var express = require('express');
var controller = require('./info.controller');

var router = express.Router();

router.get('/', controller.index);

module.exports = router;
