"use strict";

var Survey = require('./model/Survey');
var _ = require('lodash');

module.exports = function register(app) {

  // LIST
  app.get('/surveys', function (req, res) {
    Survey.find({}, function (err, surveys) {
      res.render('survey/list', {
        surveys: surveys,
        messages: {
          errors: req.flash('errors'),
          infos: req.flash('infos')
        }
      });
    });
  });

  // GET
  app.get('/survey', function (req, res) {
    res.render('survey/details', {
      survey: {},
      messages: {
        errors: req.flash('errors'),
        infos: req.flash('infos')
      }
    });
  });

  // FETCH ONE
  app.get('/survey/:id', function (req, res) {
    var surveyId = req.params.id;

    Survey.findById(surveyId, function (err, survey) {
      if (!survey) {
        req.flash('errors', 'survey not found');
        res.redirect('/survey');
        return;
      }

      res.render('survey/details', {
        survey: survey.toObject(),
        messages: {
          errors: req.flash('errors'),
          infos: req.flash('infos')
        }
      });
    });
  });

  // CREATE
  app.post('/survey', function (req, res) {
    var newSurvey = new Survey({
      name: req.body.name,
      owner: req.body.owner,
      maxResponses: req.body.maxResponses,
      campaign: req.body.campaign,
      costCenterId: req.body.costCenterId,
      netWorth: req.body.netWorth,
      questions: [
        {
          text: req.body.question1, answers: [req.body.answer11, req.body.answer12]
        },
        {
          text: req.body.question2, answers: [req.body.answer21, req.body.answer22]
        }
      ]
    });

    Survey.create(newSurvey, function (err, survey) {
      if (err) {
        req.flash('errors', err.message);
        res.redirect('/survey');
      } else {
        req.flash('info', 'created survey ' + survey.id);
        res.redirect('/survey/' + survey.id);
      }
    });

  });

  // UPDATE
  app.post('/survey/:id', function (req, res) {
      Survey.findById(req.params.id, function (err, survey) {

        if (survey) {

          // figure out what our command actually is
          _.each(req.body, function (val, key) {
            if ('op_addQuestion' === key) {

              survey.questions.push({text: '', answers: ['', '']});
              Survey.save(function (err) {
                console.log('error');
              });
            }

            if ('op_removeQuestion') {

            }
          });
        }
      });

      var existingSurvey = {
        name: req.body.name,
        owner: req.body.owner,
        maxResponses: req.body.maxResponses,
        campaign: req.body.campaign,
        costCenterId: req.body.costCenterId,
        netWorth: req.body.netWorth,
        questions: [
          {
            text: req.body.question1, answers: [req.body.answer11, req.body.answer12]
          },
          {
            text: req.body.question2, answers: [req.body.answer21, req.body.answer22]}
        ]
      };

      var id = req.params.id;

      Survey.findByIdAndUpdate(id, existingSurvey, {new: true}, function (err, survey) {
        if (err) {
          req.flash('errors', err.message);
          res.redirect('/survey/' + id);
        } else {
          req.flash('infos', 'updated survey ' + id);
          res.redirect('/survey/' + survey.id);
        }
      });
    }
  )
  ;

  // DELETE
  app.delete('/survey/:id', function (req, res) {
    var surveyId = req.params.id;

    Survey.remove(surveyId, function (err, survey) {
      res.render('/action', {
        survey: survey
      });
    });
  });
};
