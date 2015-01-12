/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');

User.find({}).remove(function() {
  User.create({
      _id: '54b3e04cde6279a8211b42fd',
      provider: 'local',
      name: 'Test User',
      email: 'test@test.com',
      password: 'test'
    }, {
      _id: '54b3e04cde6279a8211b42fe',
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'admin'
    }, function() {
      console.log('finished populating users');
    }
  );
});

/* per creare date:
 year, month, day, hour, minute, second, and millisecond:
 var d = new Date(99,5,24,11,33,30,0);
 oppure al minimo con 3 valori:
 var d = new Date(99,5,24);
 */


Thing.find({}).remove(function() {
  Thing.create({
    owner: '54b3e04cde6279a8211b42fd',
    name : 'Development Tools',
    info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.',
    due_date: new Date(2015,12,20),
    value: 240.34
  }, {
    owner: '54b3e04cde6279a8211b42fe',
    name : 'Server and Client integration',
    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.',
    due_date: new Date(2015,2,12),
    value: 54.09
  }, {
    owner: '54b3e04cde6279a8211b42fe',
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html',
    due_date: new Date(2014,12,19),
    value: 18.11
  },  {
    owner: '54b3e04cde6279a8211b42fd',
    name : 'Modular Structure',
    info : 'Best practice client and server structures allow for more code reusability and maximum scalability',
    due_date: new Date(2015,10,20),
    value: 6.87
  },  {
    owner: '54b3e04cde6279a8211b42fd',
    name : 'Optimized Build',
    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.',
    due_date: new Date(2014,9,2),
    value: 33.70
  },{
    owner: '54b3e04cde6279a8211b42fe',
    name : 'Deployment Ready',
    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators',
    due_date: new Date(2015,3,4),
    value: 350.00
  }, function() {
    console.log('finished populating things');
  });
});

