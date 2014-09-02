"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompletedSurvey = new Schema({
  surveyId: {type: String, required: true},
  userId: {type: String, required: true},
  completed: {type: Boolean, required: true},
  results: [
    {
      question: String,
      questionId: String,
      answer: String
    }
  ]
});

module.exports = mongoose.model('CompletedSurvey', CompletedSurvey);
