"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Joi = require('joi');

var User = new Schema({
  userId: String,
  email: String,
  balance: Number,
  score: Number,
  password: String,
  history: [{
    surveyId: String,
    completed: String,
    giftcardId: String
  }]
});


User.methods.joiValidate = function(obj) {

  var schema = Joi.object().keys({
    userId: Joi.string().min(24).max(24).required(),
    email: Joi.string().email().required(),
    balance: Joi.number().integer().min(0).max(100).required(),
    score: Joi.number().integer().min(0).max(100).required(),
    password: Joi.string().min(5).max(24).required(),
    history: Joi.array()
  });
  return Joi.validate(obj, schema, {allowUnknown:true,abortEarly:false});
};

module.exports = mongoose.model('User', User);
