/* Created by Leo on 18/01/2015. */
'use strict';

var config = require('../../config/environment');

exports.index = function(req, res) {
  var infos = {
    version: config.version
  };
  return res.json(200, infos);
};
