var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  userId: String,
  email: String,
  balance: Number,
  score: Number,
  password: String,
  history: [
    {
      surveyId: String,
      completed: String,
      giftcardId: String
    }
  ]
});

module.exports = mongoose.model('User', User);
