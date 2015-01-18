/**
 * Created by Leo on 18/01/2015.
 */
'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var admin_id = '54b3e04cde6279a8211b42fe';

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
