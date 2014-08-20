"use strict";

var mongoose = require("mongoose");
var Survey = mongoose.model('Survey');

/*********************
 *  REST Endpoints
 *********************/
function register(server) {
  server.get("/survey/:id", getSurveyById);
}

/*********************
 *  Resource functions
 *********************/
var getSurveyById = function (req, res, next) {
  res.cache('public', { maxAge: 300});

  Survey.findById(req.params.id).lean().exec(function (err, survey) {
    res.send(survey);
    return next();
  });

};

module.exports = {
  register: register
};