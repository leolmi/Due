'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThingStateSchema = new Schema({
  type: String,
  desc: String,
  date: Date
});

var ThingSchema = new Schema({
  owner: String,
  name: String,
  info: String,
  due_date: { type: Date, default: Date.now },
  value: Number,
  state: [ThingStateSchema],
  active: Boolean
});

module.exports = mongoose.model('Thing', ThingSchema);
