"use strict";

var mongoose = require("mongoose");
var CompletedSurvey = mongoose.model('CompletedSurvey');
var _ = require("lodash");

/*********************
 *  REST Endpoints
 *********************/
function register(server) {
  server.get("/completedSurveys", getCompletedSurveys);
  server.get("/completedSurvey/:id", getCompletedSurveyById);
  server.post("/completedSurvey", postSurvey);
  server.del("/completedSurvey/:id", removeCompletedSurveyById);
  server.put("/completedSurvey/:id", updateCompletedSurveyById);
  server.patch("/completedSurvey/:id", patchCompletedSurveyById);
}

var getCompletedSurveyById = function(req, res, next) {
  res.cache('public', {
    maxAge: 300
  });

  CompletedSurvey.findById(req.params.id).lean().exec(function(err, survey) {
    if (err) {
      res.status(400);
      if (err.name && err.name === "CastError") {
        res.send({
          message: 'Bad id'
        });
      } else {
        res.send({
          message: err.message
        });
      }
    } else if (!survey) {
      res.status(404);
      res.send({
        message: "Not found"
      });
    } else {
      res.send(survey);
    }

    return next();
  });
};

var getCompletedSurveys = function (req, res, next) {
  res.cache('public', { maxAge: 300 });

  CompletedSurvey.find({}).lean().exec(function (err, surveys) {
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

var postSurvey = function(req, res, next) {
  res.cache('public', {
    maxAge: 300
  });

  if (!req.body) {
    res.status(400);
    res.send({
      message: 'Missing body'
    });

    return next();
  }

  var completedSurvey = {
    surveyId: req.body.surveyId,
    userId: req.body.userId,
    completed: req.body.completed,
    results: req.body.results
  };

  CompletedSurvey.create(completedSurvey, function(err, survey) {
    if (err) {
      res.status(400);
      res.send({
        message: err.message
      });
    } else {
      res.status(201);
      res.send(survey);
    }

    return next();
  });
};

var removeCompletedSurveyById = function(req, res, next) {
  res.cache('public', {
    maxAge: 300
  });

  CompletedSurvey.findByIdAndRemove(req.params.id).lean().exec(function(err,
    survey) {
    if (err) {
      res.status(400);
      if (err.name && err.name === "CastError") {
        res.send({
          message: 'Bad id'
        });
      } else {
        res.send({
          message: err.message
        });
      }
    } else if (!survey) {
      res.status(404);
      res.send({
        message: "Not found"
      });
    } else {
      res.send(survey);
    }
    return next();
  });
};

var updateCompletedSurveyById = function(req, res, next) {
  res.cache('public', {
    maxAge: 300
  });

  if (!req.body) {
    res.status(400);
    res.send({
      message: 'Missing body'
    });

    return next();
  }

  CompletedSurvey.findById(req.params.id, function(err, survey) {
    if (err) {
      res.status(400);
      if (err.name && err.name === "CastError") {
        res.send({
          message: 'Bad id'
        });
      } else {
        res.send({
          message: err.message
        });
      }
    } else if (!survey) {
      res.status(404);
      res.send({
        message: "Not found"
      });
    } else {

      // set the data from the request onto the existing object
      survey.surveyId = req.body.surveyId;
      survey.userId = req.body.userId;
      survey.completed = req.body.completed;
      survey.results = req.body.results;

      survey.save(function(err, survey) {
        if (err) {
          res.status(400);
          res.send({
            message: err.message
          });
        } else {
          res.send(survey);
        }

        return next();
      });
    }

    return next();
  });
};

var patchCompletedSurveyById = function(req, res, next) {
  res.cache('public', {
    maxAge: 300
  });

  if (!req.body) {
    res.status(400);
    res.send({
      message: 'Missing body'
    });

    return next();
  }

  CompletedSurvey.findById(req.params.id, function(err, survey) {
    if (err) {
      res.status(400);
      if (err.name && err.name === "CastError") {
        res.send({
          message: 'Bad id'
        });
      } else {
        res.send({
          message: err.message
        });
      }
    } else if (!survey) {
      res.status(404);
      res.send({
        message: "Not found"
      });
    } else {
      // set the data from the request onto the existing object
      patchField(survey, "surveyId", req.body.surveyId);
      patchField(survey, "userId", req.body.userId);
      patchField(survey, "completed", req.body.completed);
      patchField(survey, "results", req.body.results);

      survey.save(function(err, survey) {
        if (err) {
          res.status(400);
          res.send({
            message: err.message
          });
        } else {
          res.send(survey);
        }

        return next();
      });
    }

    return next();
  });
};

var patchField = function(object, fieldName, value) {
  if (_.isNull(value)) {
    object[fieldName] = undefined;
  } else if (value) {
    object[fieldName] = value;
  }
};

module.exports = {
  register: register
};
