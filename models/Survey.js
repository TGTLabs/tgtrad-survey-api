var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Survey = new Schema({
  name: String,
  owner: String,
  maxResponses: Number,
  campaign: String,
  costCenterId: String,
  netWorth: Number,
  questions: [
    {
      text: String,
      answers: [String]
    },
  ]
});

Survey.index({ name: 1, owner: 1 }, { unique: true });

module.exports = mongoose.model('Survey', Survey);