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

/*********************
 *  Resource functions
 *********************/

var getCompletedSurveyById = function(req, res, next) {
  res.cache('public', {
    maxAge: 300
  });

  CompletedSurvey.findById(req.params.id).lean().exec(function(err,
    completedSurvey) {
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
    } else if (!completedSurvey) {
      res.status(404);
      res.send({
        message: "Not found"
      });
    } else {
      res.send(completedSurvey);
    }

    return next();
  });
};

var getCompletedSurveys = function(req, res, next) {
  res.cache('public', {
    maxAge: 300
  });

  CompletedSurvey.find({}).lean().exec(function(err, surveys) {
    if (err) {
      res.status(400);
      res.send({
        message: err.message
      });
    } else if (!surveys) {
      res.status(404);
      res.send({
        message: "Not found"
      });
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

  var newCompletedSurvey = {
    surveyId: req.body.surveyId,
    userId: req.body.userId,
    completed: req.body.completed,
    results: req.body.results
  };
  var completedSurvey = new CompletedSurvey(newCompletedSurvey);
  var validateErr = completedSurvey.joiValidate(completedSurvey).error;
  if (validateErr === null) {

    CompletedSurvey.create(completedSurvey, function(err, completedSurvey) {
      if (err) {
        res.status(400);
        res.send({
          message: err.message
        });
      } else {
        res.status(201);
        res.send(completedSurvey);
      }

      return next();
    });
  } else {

    res.status(406);
    res.send(validateErr);
    return next();
  }
};

var removeCompletedSurveyById = function(req, res, next) {
  res.cache('public', {
    maxAge: 300
  });

  CompletedSurvey.findByIdAndRemove(req.params.id).lean().exec(function(err,
    completedSurvey) {
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
    } else if (!completedSurvey) {
      res.status(404);
      res.send({
        message: "Not found"
      });
    } else {
      res.send(completedSurvey);
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


  CompletedSurvey.findById(req.params.id, function(err, completedSurvey) {
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
    } else if (!completedSurvey) {
      res.status(404);
      res.send({
        message: "Not found"
      });
    } else {

      // set the data from the request onto the existing object
      completedSurvey.surveyId = req.body.surveyId;
      completedSurvey.userId = req.body.userId;
      completedSurvey.completed = req.body.completed;
      completedSurvey.results = req.body.results;

      var validateErr = completedSurvey.joiValidate(completedSurvey).error;
      if (validateErr === null) {
        completedSurvey.save(function(err, completedSurvey) {
          if (err) {
            res.status(400);
            res.send({
              message: err.message
            });
          } else {
            res.send(completedSurvey);
          }

          return next();
        });
      } else {
        res.status(406);
        res.send(validateErr);
        return next();
      }
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

  CompletedSurvey.findById(req.params.id, function(err, completedSurvey) {
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
    } else if (!completedSurvey) {
      res.status(404);
      res.send({
        message: "Not found"
      });
    } else {
      // set the data from the request onto the existing object
      patchField(completedSurvey, "surveyId", req.body.surveyId);
      patchField(completedSurvey, "userId", req.body.userId);
      patchField(completedSurvey, "completed", req.body.completed);
      patchField(completedSurvey, "results", req.body.results);

      var validateErr = completedSurvey.joiValidate(completedSurvey).error;
      if (validateErr === null) {

        completedSurvey.save(function(err, completedSurvey) {
          if (err) {
            res.status(400);
            res.send({
              message: err.message
            });
          } else {
            res.send(completedSurvey);
          }

          return next();
        });
      } else {
        res.status(406);
        res.send(validateErr);
        return next();
      }
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
