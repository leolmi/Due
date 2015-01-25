/**
 * Created by Leo on 25/01/2015.
 */
'use strict';

var _ = require('lodash');
var config = require('../../config/environment');
var nodemailer = require('nodemailer');
var _transporter = undefined;

var parse = function() {
  console.log('Configurazioni dell mail: '+config.mail);
  var values = config.mail.split('|');
  return {
    email: values[0],
    password:values[1],
    service: values[2]
  }
};

// create reusable transporter object using SMTP transport
var getTransporter = function() {
  if (!_transporter) {
    var infos = parse(config.mail);
    _transporter = nodemailer.createTransport({
      service: infos.service,
      auth: {
        user: infos.email,
        pass: infos.password
      }
    });
  }
  return _transporter;
};

var parseOptions = function(data, next){
  //TODO: interpreta la richiesta inserendo i dati necessari al corretto invio

  next({
    from: data.from, // sender address
    to: data.to, // list of receivers
    subject: data.subject, // Subject line
    text: data.text, // plaintext body
    html: data.html // html body
  })
};

exports.send = function(req, res) {
  console.log("mail da inviare: "+JSON.stringify(req.body));
  parseOptions(req.body,  function(mail){
    var transporter = getTransporter();
    transporter.sendMail(options, function(err, info){
      if(err) return res.send(500, err);
      res.json(200, info);
    });
  });
};
