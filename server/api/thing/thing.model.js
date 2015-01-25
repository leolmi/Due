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
  active: Boolean
}, { versionKey: false });

module.exports = mongoose.model('Thing', ThingSchema);
