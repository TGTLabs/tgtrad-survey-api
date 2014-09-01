/* jshint strict: false, expr: true */
/* global describe */

var should = require('chai').should();
var supertest = require('supertest');

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var Survey = require('../../shared/models/survey');
var server = require('../../lib/restify')('mocha-test-server');
require('../../api/resources/survey').register(server);

describe("/survey resources", function () {
  beforeEach(function (done) {
    mockgoose.reset();
    return done();
  });

  var sampleSurvey = new Survey();
  sampleSurvey.name = "my test name CREATED";
  sampleSurvey.campaign = "some new campaign";
  sampleSurvey.owner = "donnie";
  sampleSurvey.maxResponses = 100;
  sampleSurvey.costCenterId = "someCostCenter";
  sampleSurvey.netWorth = 1000;
  sampleSurvey._id = '53f3ab80432f102a2f06d401';

  describe("POST", function () {
    it("[400] payload missing", function (done) {
      supertest(server)
        .post('/survey')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(400)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('object');

          body.should.have.property('message').that.match(/missing body/i);

          return done();
        });
    });

    it("[400] payload not JSON", function (done) {
      supertest(server)
        .post('/survey')
        .set('Accept', 'application/json')
        .set('Content-Type', 'text/xml')
        .expect(400)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('object');

          body.should.have.property('message').that.match(/missing body/i);

          return done();
        });
    });

    it("[201] created", function (done) {
      supertest(server)
        .post('/survey')
        .send(JSON.stringify(sampleSurvey))
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(201)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('object');

          body.should.have.property('name', 'my test name CREATED');
          body.should.have.property('owner', 'donnie');
          body.should.have.property('campaign', 'some new campaign');
          body.should.have.property('_id');

          // confirm created
          Survey.findById(body._id, function (err, survey) {
            survey.should.have.property('name', 'my test name CREATED');
            survey.should.have.property('owner', 'donnie');
            survey.should.have.property('campaign', 'some new campaign');

            return done();
          });
        });
    });
  });

  describe("PATCH byId", function () {
    beforeEach(function (done) {
      Survey.create(sampleSurvey, function (err) {
        return done(err);
      });
    });

    it("[404] Id is not found", function (done) {
      supertest(server)
        .patch('/survey/53f3ab80432f102a2f06d330')
        .send({name: 'my test name UPDATED', owner: 'donnie'})
        .set('Accept', 'application/json')
        .expect(404)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('object');

          body.should.have.property('message').that.match(/not found/i);

          return done();
        });
    });

    it("[400] improper format of Id", function (done) {
      supertest(server)
        .patch('/survey/bad_id')
        .send({name: 'my test name UPDATED', owner: 'donnie'})
        .set('Accept', 'application/json')
        .expect(400)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('object');

          body.should.have.property('message').that.match(/bad id/i);

          return done();
        });
    });

    it("[400] missing body", function (done) {
      supertest(server)
        .patch('/survey/53f3ab80432f102a2f06d401')
        .set('Accept', 'application/json')
        .expect(400)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('object');

          body.should.have.property('message').that.match(/missing body/i);

          return done();
        });
    });

    it("[200] Id was patched", function (done) {
      supertest(server)
        .patch('/survey/53f3ab80432f102a2f06d401')
        .send({name: 'my test name PATCHED'})
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('object');

          body.should.have.property('name', 'my test name PATCHED');
          body.should.have.property('owner', 'donnie');
          body.should.have.property('campaign', 'some new campaign');

          // confirm patched
          Survey.findById("53f3ab80432f102a2f06d401", function (err, survey) {
            survey.should.have.property('name', 'my test name PATCHED');
            survey.should.have.property('owner', 'donnie');
            survey.should.have.property('campaign', 'some new campaign');

            return done();
          });
        });
    });
  });

  describe("PUT byId", function () {
    beforeEach(function (done) {
      Survey.create(sampleSurvey, function (err) {
        return done(err);
      });
    });

    it("[404] Id is not found", function (done) {
      supertest(server)
        .put('/survey/53f3ab80432f102a2f06d330')
        .send({name: 'my test name UPDATED', owner: 'donnie'})
        .set('Accept', 'application/json')
        .expect(404)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('object');

          body.should.have.property('message').that.match(/not found/i);

          return done();
        });
    });

    it("[400] improper format of Id", function (done) {
      supertest(server)
        .put('/survey/bad_id')
        .send({name: 'my test name UPDATED', owner: 'donnie'})
        .set('Accept', 'application/json')
        .expect(400)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('object');

          body.should.have.property('message').that.match(/bad id/i);

          return done();
        });
    });

    it("[400] missing body", function (done) {
      supertest(server)
        .put('/survey/53f3ab80432f102a2f06d401')
        .set('Accept', 'application/json')
        .expect(400)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('object');

          body.should.have.property('message').that.match(/missing body/i);

          return done();
        });
    });

    it("[200] Id was updated", function (done) {
      var updatedSurvey = new Survey();
      updatedSurvey.name = "my test name UPDATED";
      updatedSurvey.campaign = sampleSurvey.campaign;
      updatedSurvey.owner = sampleSurvey.owner;
      updatedSurvey.maxResponses = sampleSurvey.maxResponses;
      updatedSurvey.costCenterId = sampleSurvey.costCenterId;
      updatedSurvey.netWorth = sampleSurvey.netWorth;

      supertest(server)
        .put('/survey/53f3ab80432f102a2f06d401')
        .send(JSON.stringify(updatedSurvey))
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('object');

          body.should.have.property('name', 'my test name UPDATED');
          body.should.have.property('owner', 'donnie');
          body.should.not.have.property('status');

          // confirm updated
          Survey.findById("53f3ab80432f102a2f06d401", function (err, survey) {
            survey.should.have.property('name', 'my test name UPDATED');
            survey.should.have.property('owner', 'donnie');
            survey.should.not.have.property('status');

            return done();
          });
        });
    });
  });

  describe("DELETE byId", function () {
    beforeEach(function (done) {
      Survey.create(sampleSurvey, function (err) {
        return done(err);
      });
    });

    it("[404] Id is not found", function (done) {
      supertest(server)
        .delete('/survey/53f3ab80432f102a2f06d330')
        .set('Accept', 'application/json')
        .expect(404)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('object');

          body.should.have.property('message').that.match(/not found/i);

          return done();
        });
    });

    it("[400] improper format of Id", function (done) {
      supertest(server)
        .delete('/survey/bad_id')
        .set('Accept', 'application/json')
        .expect(400)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('object');

          body.should.have.property('message').that.match(/bad id/i);

          return done();
        });
    });

    it("[200] Id was deleted", function (done) {
      supertest(server)
        .delete('/survey/53f3ab80432f102a2f06d401')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('object');

          body.should.have.property('name', 'my test name CREATED');
          body.should.have.property('owner', 'donnie');

          // confirm deletion
          Survey.findById("53f3ab80432f102a2f06d381", function (err, survey) {

            should.not.exist(survey);

            return done();
          });
        });
    });
  });

  describe("GET all", function () {
    it("[200] no surveys empty array", function (done) {
      supertest(server)
        .get('/surveys')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('array');

          body.should.have.length(0);

          return done();
        });
    });

    it("[200] all surveys", function (done) {
      Survey.create(sampleSurvey, function (err) {
        if (err) {
          return done(err);
        }

        var survey2 = new Survey();
        survey2.name = "my test name CREATED2";
        survey2.campaign = "some new campaign";
        survey2.owner = "donnie";
        survey2.maxResponses = 100;
        survey2.costCenterId = "someCostCenter";
        survey2.netWorth = 1000;
        survey2._id = '53f3ab80432f102a2f06d402';

        Survey.create(survey2, function (err) {
          if (err) {
            return done(err);
          }
        });
      });

      supertest(server)
        .get('/surveys')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('array');

          body.should.have.length(2);

          body[0].should.have.property('name', 'my test name CREATED');
          body[0].should.have.property('owner', 'donnie');

          body[1].should.have.property('name', 'my test name CREATED2');
          body[1].should.have.property('owner', 'donnie');

          return done();
        });
    });
  });

  describe("GET byId", function () {
    beforeEach(function (done) {
      Survey.create(sampleSurvey, function (err) {
        return done(err);
      });
    });

    it("[404] Id is not found", function (done) {
      supertest(server)
        .get('/survey/53f3ab80432f102a2f06d400')
        .set('Accept', 'application/json')
        .expect(404)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('object');

          body.should.have.property('message').that.match(/not found/i);

          return done();
        });
    });

    it("[400] improper format of Id", function (done) {
      supertest(server)
        .get('/survey/badId')
        .set('Accept', 'application/json')
        .expect(400)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('object');

          body.should.have.property('message').that.match(/bad id/i);

          return done();
        });
    });

    it("[200] survey exists", function (done) {
      supertest(server)
        .get('/survey/53f3ab80432f102a2f06d401')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('object');

          body.should.have.property('name', 'my test name CREATED');
          body.should.have.property('owner', 'donnie');

          return done();
        });
    });
  });
});