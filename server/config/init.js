/**
 * Created by Leo on 18/01/2015.
 */
'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');


User.find({}).remove(function() {
  User.create({
    _id: admin_id,
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'leo.olmi@gmail.com',
    password: 'carciofo'
  },function() {
    console.log('Terminato di brasare gli utenti.');
  });
});

Thing.find({}).remove(function() {
  console.log('Terminato di brasare le cose.');
});
