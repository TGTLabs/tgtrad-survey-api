"use strict";

var mongoose = require("mongoose");
var Survey = mongoose.model('Survey');

/*********************
 *  REST Endpoints
 *********************/
function register(server) {
  server.get("/survey/:id", getSurveyById);
  server.get("/surveys", getSurveys);
  server.post("/postSurvey", postSurvey);
}

/*********************
 *  Resource functions
 *********************/
var getSurveyById = function (req, res, next) {
  res.cache('public', { maxAge: 300 });

  Survey.findById(req.params.id).lean().exec(function (err, survey) {
    if (err) {
      res.status(400);
      if (err.name && err.name === "CastError") {
        res.send({ message: 'Bad id'});
      } else {
        res.send({ message: err.message});
      }
    } else if (!survey) {
      res.status(404);
      res.send({message: "Not found"});
    } else {
      res.send(survey);
    }

    return next();
  });
};

var getSurveys = function (req, res, next) {
  res.cache('public', { maxAge: 300 });

  Survey.find({}).lean().exec(function (err, surveys) {
    if (err) {
      res.status(400);
      res.send({ message: err.message});
    } else if (!surveys) {
      res.status(404);
      res.send({message: "Not found"});
    } else {
      res.send(surveys);
    }

    return next();
  });
};

var postSurvey = function (req, res, next) {
  res.cache('public', {maxAge: 300});

  var newSurvey = {
    name: req.body.name,
    owner: req.body.owner,
    maxResponses: req.body.maxResponses,
    campaign: req.body.campaign,
    costCenterId: req.body.costCenterId,
    netWorth: req.body.netWorth
  };

  Survey.create(newSurvey, function (err, survey) {
    res.send(survey);

    return next();
  });
};

module.exports = {
  register: register
};
