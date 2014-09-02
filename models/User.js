"use strict";

var mongoose = require('mongoose');
var validators = require("../lib/mongoose/validators");
var Schema = mongoose.Schema;

// custom validators
var emailAddress = [validators.isEmail, "Path '{PATH}' is not an valid email address"];

// schema
var User = new Schema({
  email: {type: String, required: true, validate: emailAddress},
  balance: Number,
  score: Number,
  history: [{
    surveyId: String,
    completed: String,
    giftcardId: String
  }]
});

module.exports = mongoose.model('User', User);
