/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
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
    email: 'admin@admin.com',
    password: 'admin'
  },{
      _id: '54b3e04cde6279a8211b42fd',
      provider: 'local',
      name: 'Test User',
      email: 'test@test.com',
      password: 'test'
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
    due_date: new Date('2015-12-20'),
    value: 240.34
  }, {
    owner: '54b3e04cde6279a8211b42fe',
    name : 'Server and Client integration',
    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.',
    due_date: new Date('2015-2-12'),
    value: 54.09
  }, {
    owner: '54b3e04cde6279a8211b42fe',
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html',
    due_date: new Date('2014-12-19'),
    value: 18.11
  },  {
    owner: '54b3e04cde6279a8211b42fd',
    name : 'Modular Structure',
    info : 'Best practice client and server structures allow for more code reusability and maximum scalability',
    due_date: new Date('2015-1-20'),
    value: 6.87,
    state: [{
      type: 'pagamento',
      desc: 'pagata prima parte',
      date: new Date('2015-1-7'),
      value: 5.00
    }]
  },  {
    owner: '54b3e04cde6279a8211b42fd',
    name : 'Optimized Build',
    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.',
    due_date: new Date('2014-9-2'),
    value: 33.70,
    state: [{
      type: 'pagamento',
      desc: 'pagato',
      date: new Date('2015-1-1'),
      value: 33.90
    }]
  },{
    owner: '54b3e04cde6279a8211b42fe',
    name : 'Deployment Ready',
    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators',
    due_date: new Date('2015-3-4'),
    value: 350.00
  },{
    owner: '54b3e04cde6279a8211b42fd',
    name : 'Uno (next)',
    info : '',
    due_date: new Date('2015-1-20'),
    value: 6.87
  },{
    owner: '54b3e04cde6279a8211b42fd',
    name : 'Due (next)',
    info : '',
    due_date: new Date('2015-1-21'),
    value: 7.87
  },{
    owner: '54b3e04cde6279a8211b42fd',
    name : 'Tre (next)',
    info : '',
    due_date: new Date('2015-1-22'),
    value: 8.87
  },{
    owner: '54b3e04cde6279a8211b42fd',
    name : 'Quattro (next)',
    info : '',
    due_date: new Date('2015-2-10'),
    value: 9.87
  },{
    owner: '54b3e04cde6279a8211b42fd',
    name : 'Cinque (next)',
    info : '',
    due_date: new Date('2015-2-11'),
    value: 10.87
  },{
    owner: '54b3e04cde6279a8211b42fd',
    name : 'Sei (next)',
    info : '',
    due_date: new Date('2015-2-12'),
    value: 11.87
  },{
    owner: '54b3e04cde6279a8211b42fd',
    name : 'sette (next)',
    info : '',
    due_date: new Date('2015-3-11'),
    value: 12.87
  },{
    owner: '54b3e04cde6279a8211b42fd',
    name : 'Otto (next)',
    info : '',
    due_date: new Date('2015-3-12'),
    value: 13.87
  },{
    owner: '54b3e04cde6279a8211b42fd',
    name : 'Nove (next)',
    info : '',
    due_date: new Date('2015-3-13'),
    value: 14.87
  },{
    owner: '54b3e04cde6279a8211b42fd',
    name : 'Dieci (next)',
    info : '',
    due_date: new Date('2015-4-11'),
    value: 15.87
  },{
    owner: '54b3e04cde6279a8211b42fd',
    name : 'Undici (next)',
    info : '',
    due_date: new Date('2015-4-12'),
    value: 16.87
  },{
    owner: '54b3e04cde6279a8211b42fd',
    name : 'Dodici (next)',
    info : '',
    due_date: new Date('2015-4-13'),
    value: 17.87
  }, function() {
    console.log('finished populating things');
  });
});

