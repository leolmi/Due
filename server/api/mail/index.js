/**
 * Created by Leo on 25/01/2015.
 */
'use strict';

var express = require('express');
var controller = require('./mail.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/', auth.isAuthenticated(), controller.send);

module.exports = router;
