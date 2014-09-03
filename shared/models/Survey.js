"use strict";

var mongoose = require('mongoose');
var validators = require("../lib/mongoose/validators");
var Schema = mongoose.Schema;

// custom validators
var stringLength = [validators.stringLengthValidator(3, 30), "Path '{PATH}' requires length between 3 and 30"];

// Schema
var Survey = new Schema({
  name: { type: String, required: true, trim: true, validate: stringLength },
  owner: { type: String, required: true, trim: true, validate: stringLength },
  maxResponses: { type: Number, required: true, min: 100, max: 1000 },
  responses: { type: Number, min: 0, max: 1100 },
  campaign: { type: String, required: true, trim: true },
  costCenterId: { type: String, required: true, trim: true},
  netWorth: Number,
  logoUrl: String,
  status: String,
  startDate: { type: Date, required: true},
  endDate: { type: Date, required: true},
  questions: [
    {
      title: { type: String, required: true },
      _type: { type: String, required: true, enum: ['text', 'image', 'rating'] },
      text: [String],
      url: [String]
    },
  ]
});

// Indexes
Survey.index({ name: 1, owner: 1 }, { unique: true });

module.exports = mongoose.model('Survey', Survey);
