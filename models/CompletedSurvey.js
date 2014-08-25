var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

module.exports = mongoose.model('CompletedSurvey', CompletedSurvey);
