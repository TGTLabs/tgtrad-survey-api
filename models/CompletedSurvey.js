"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Joi = require('joi');

var CompletedSurvey = new Schema({
  surveyId: String,
  userId: String,
  completed: String,
  results: [
    {
      question: String,
      questionId: String,
      answer: String
    }
  ]
});

CompletedSurvey.methods.joiValidate = function(obj) {

  var schema = Joi.object().keys({
    surveyId: Joi.string().min(24).max(24).required(),
    userId: Joi.string().min(24).max(24).required(),
    completed: Joi.date().required(),
    results: Joi.array()
  });
  return Joi.validate(obj, schema, {allowUnknown:true,abortEarly:false});
};

module.exports = mongoose.model('CompletedSurvey', CompletedSurvey);
