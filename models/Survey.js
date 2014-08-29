"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Joi = require('joi');

var Survey = new Schema({
  name: String,
  owner: String,
  maxResponses: Number,
  campaign: String,
  costCenterId: String,
  netWorth: Number,
  logoUrl: String,
  status: String, //Draft, Published, Deactivated, Done
  questions: [{
    text: String,
    answers: [String]
  }, ]
});

// Survey.index({
//   name: 1,
//   owner: 1
// }, {
//   unique: true
// });

Survey.methods.joiValidate = function(obj) {

  var schema = Joi.object().keys({
		name: Joi.string().min(3).max(30).required(),
		owner: Joi.string().min(3).max(30).required(),
		maxResponses: Joi.number().integer().min(100).max(1000).required(),
		campaign: Joi.string().required(),
		costCenterId: Joi.string().required(),
		netWorth: Joi.number().required(),
    logoUrl: Joi.string(),
    status: Joi.string(),
    questions: Joi.array()
	});
	return Joi.validate(obj, schema, {allowUnknown:true,abortEarly:false});
};


module.exports = mongoose.model('Survey', Survey);
