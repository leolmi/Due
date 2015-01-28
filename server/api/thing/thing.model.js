'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThingStateSchema = new Schema({
  type: String,
  desc: String,
  date: Date,
  value: Number,
  selected: Boolean
});

var ThingRemindSchema = new Schema({
  date: Date,
  value: String,
  repeat: String
});

var ThingSchema = new Schema({
  owner: String,
  type: String,
  name: String,
  info: String,
  due_date: { type: Date, default: Date.now },
  value: Number,
  state: [ThingStateSchema],
  reminds: [ThingRemindSchema],
  paid: Boolean,
  active: Boolean
}, { versionKey: false });

/**
 * Se vero il pagamento è stato saldato
 * @returns {boolean}
 */
//ThingSchema.methods.paid = function () {
//  var tot = 0;
//  if (this.state && this.state.length) {
//    this.state.forEach(function (s) {
//        tot += parseFloat(s.value);
//    });
//  }
//  return (tot>=this.value);
//};

module.exports = mongoose.model('Thing', ThingSchema);
