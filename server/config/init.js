/**
 * Created by Leo on 18/01/2015.
 */
'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');


User.find({}).remove(function() {
  console.log('Terminato di brasare le cose.');
});

Thing.find({}).remove(function() {
  console.log('Terminato di brasare le cose.');
});
