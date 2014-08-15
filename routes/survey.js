var Q = require('q');
var db = require('../lib/db');

module.exports = function register(app) {

    app.get('/survey/:id', function(req, res) {
        // ensure we have an ID
        var surveyId = req.params.id;

        return db.pooledConnection()
            // find survey
            .then(function (db) {
                var deferred = Q.defer();

                db.collection('survey')
                    .findOne({ surveyID: surveyId }, function (err, survey) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(survey);
                        }
                    });

                return deferred.promise;
            })
            // process the survey data in a template
            .then( function (survey) {
                res.render('take_survey', {
                    survey: survey
                });
            });
    });
};
