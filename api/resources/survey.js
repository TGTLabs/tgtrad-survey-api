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
  res.cache('public', { maxAge: 300});

  Survey.findById(req.params.id).lean().exec(function (err, survey) {
    if(err) {
      console.log(err);
      res.status(400);
      res.send("ID does not match correct format");
    } else if (!survey){
      res.status(404);
      res.send("Not found");
    } else {
      res.send(survey);
    }
    return next();
  });
};

var getSurveys = function(req, res, next) {
  res.cache('public', { maxAge: 300});

  Survey.find({}).lean().exec(function (err, surveys) {
    if(err) {
      console.log(err);
      res.status(400);
      res.send("ID does not match correct format");
    } else if (!surveys){
      res.status(404);
      res.send("Not found");
    } else {
      res.send(surveys);
    }
    return next();
  });
};

var postSurvey = function(req, res,next){
res.cache('public', {maxAge: 300});

console.log(req.body);
  var newSurvey = new Survey({
    name: req.body.name,
    owner: req.body.owner,
    maxResponses: req.body.maxResponses,
    campaign: req.body.campaign,
    costCenterId: req.body.costCenterId,
    netWorth: req.body.netWorth,
  });

  Survey.create(newSurvey, function (err, survey) {
     console.log(err);
     res.send(survey);
  });

}

module.exports = {
  register: register
};
