"use strict";

var mongoose = require("mongoose");
var Survey = mongoose.model('Survey');

/*********************
 *  REST Endpoints
 *********************/
function register(server) {
  server.get("/surveys", getSurveys);
  server.get("/survey/:id", getSurveyById);
  server.post("/survey", addSurvey);
  server.del("/survey/:id", removeSurveyById);
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

var removeSurveyById = function (req, res, next) {
  res.cache('public', { maxAge: 300 });

  Survey.findByIdAndRemove(req.params.id).lean().exec(function (err, survey) {
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
      res.send({message: "removed"});
    }

    return next();
  });
};

var getSurveys = function (req, res, next) {
  res.cache('public', { maxAge: 300 });

  Survey.find({}).lean().exec(function (err, surveys) {
    if (err) {
      res.status(400);
      res.send({ message: err.message });
    } else if (!surveys) {
      res.status(404);
      res.send({ message: "Not found" });
    } else {
      res.send(surveys);
    }

    return next();
  });
};

var addSurvey = function (req, res, next) {
  res.cache('public', {maxAge: 300});

  var newSurvey = {
    name: req.body.name,
    owner: req.body.owner,
    maxResponses: req.body.maxResponses,
    campaign: req.body.campaign,
    costCenterId: req.body.costCenterId,
    netWorth: req.body.netWorth,
    questions: req.body.questions
  };

  Survey.create(newSurvey, function (err, survey) {
    if (err) {
      res.status(400);
      res.send({ message: err.message });
    } else {
      res.status(201);
      res.send(survey);
    }

    return next();
  });
};

module.exports = {
  register: register
};
