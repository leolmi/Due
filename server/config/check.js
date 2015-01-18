/**
 * Created by Valentina on 18/01/2015.
 */
'use strict';

var User = require('../api/user/user.model');
var admin_id = '54b3e04cde6279a8211b42fe';


User.findById(admin_id, function (err, user) {
  if (!user) {
    User.create({
      _id: admin_id,
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'leo.olmi@gmail.com',
      password: 'carciofo'
    });
  }
  console.log('Terminata verifica degli utenti.');
});
