'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/dueapp-dev'
  },

  mail: process.env.MAIL_PSW,

  seedDB: true
};
