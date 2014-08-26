/* jshint strict: false, expr: true */
/* global describe */

var should = require('chai').should();
var supertest = require('supertest');

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var CompletedSurvey = require('../../models/completedSurvey');
var server = require('../../lib/server')('mocha-test-server');
require('../../api/resources/completedSurvey').register(server);

describe("/completedSurvey resources", function () {
  beforeEach(function (done) {
    mockgoose.reset();
    return done();
  });

  describe("POST", function () {
    it("[400] payload missing", function (done) {
      supertest(server)
        .post('/completedSurvey')
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
        .post('/completedSurvey')
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
        .post('/completedSurvey')
        .send({surveyId: 'my test surveyId CREATED', userId: "some new userId", completed: "today"})
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

          body.should.have.property('surveyId', 'my test surveyId CREATED');
          body.should.have.property('completed', 'today');
          body.should.have.property('userId', 'some new userId');
          body.should.have.property('_id');

          // confirm created
          CompletedSurvey.findById(body._id, function (err, completedSurvey) {
            completedSurvey.should.have.property('surveyId', 'my test surveyId CREATED');
            completedSurvey.should.have.property('completed', 'today');
            completedSurvey.should.have.property('userId', 'some new userId');

            return done();
          });
        });
    });
  });

  describe("PATCH byId", function () {
    beforeEach(function (done) {
      CompletedSurvey.create({surveyId: 'my test surveyId', completed: 'today', userId: "some userId", _id: '53f3ab80432f102a2f06d401'}, function (err) {
        return done(err);
      });
    });

    it("[404] Id is not found", function (done) {
      supertest(server)
        .patch('/completedSurvey/53f3ab80432f102a2f06d330')
        .send({surveyId: 'my test surveyId UPDATED', completed: 'today'})
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
        .patch('/completedSurvey/bad_id')
        .send({surveyId: 'my test surveyId UPDATED', completed: 'today'})
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
        .patch('/completedSurvey/53f3ab80432f102a2f06d401')
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
        .patch('/completedSurvey/53f3ab80432f102a2f06d401')
        .send({surveyId: 'my test surveyId PATCHED'})
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('object');

          body.should.have.property('surveyId', 'my test surveyId PATCHED');
          body.should.have.property('completed', 'today');
          body.should.have.property('userId', 'some userId');

          // confirm patched
          CompletedSurvey.findById("53f3ab80432f102a2f06d401", function (err, completedSurvey) {
            completedSurvey.should.have.property('surveyId', 'my test surveyId PATCHED');
            completedSurvey.should.have.property('completed', 'today');
            completedSurvey.should.have.property('userId', 'some userId');

            return done();
          });
        });
    });
  });

  describe("PUT byId", function () {
    beforeEach(function (done) {
      CompletedSurvey.create({surveyId: 'my test surveyId', completed: 'today', userId: "should be gone after put", _id: '53f3ab80432f102a2f06d391'}, function (err) {
        return done(err);
      });
    });

    it("[404] Id is not found", function (done) {
      supertest(server)
        .put('/completedSurvey/53f3ab80432f102a2f06d330')
        .send({surveyId: 'my test surveyId UPDATED', completed: 'today'})
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
        .put('/completedSurvey/bad_id')
        .send({surveyId: 'my test surveyId UPDATED', completed: 'today'})
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
        .put('/completedSurvey/53f3ab80432f102a2f06d391')
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
      supertest(server)
        .put('/completedSurvey/53f3ab80432f102a2f06d391')
        .send({surveyId: 'my test surveyId UPDATED', completed: 'today'})
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('object');

          body.should.have.property('surveyId', 'my test surveyId UPDATED');
          body.should.have.property('completed', 'today');
          body.should.not.have.property('userId');

          // confirm updated
          CompletedSurvey.findById("53f3ab80432f102a2f06d391", function (err, completedSurvey) {
            completedSurvey.should.have.property('surveyId', 'my test surveyId UPDATED');
            completedSurvey.should.have.property('completed', 'today');
            completedSurvey.should.not.have.property('userId');

            return done();
          });
        });
    });
  });

  describe("DELETE byId", function () {
    beforeEach(function (done) {
      CompletedSurvey.create({surveyId: 'my test surveyId', completed: 'today', _id: '53f3ab80432f102a2f06d381'}, function (err) {
        return done(err);
      });
    });

    it("[404] Id is not found", function (done) {
      supertest(server)
        .delete('/completedSurvey/53f3ab80432f102a2f06d330')
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
        .delete('/completedSurvey/bad_id')
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
        .delete('/completedSurvey/53f3ab80432f102a2f06d381')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('object');

          body.should.have.property('surveyId', 'my test surveyId');
          body.should.have.property('completed', 'today');

          // confirm deletion
          CompletedSurvey.findById("53f3ab80432f102a2f06d381", function (err, completedSurvey) {

            should.not.exist(completedSurvey);

            return done();
          });
        });
    });
  });

  describe("GET all", function () {
    it("[200] no completedSurveys empty array", function (done) {
      supertest(server)
        .get('/completedSurveys')
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

    it("[200] all completedSurveys", function (done) {
      CompletedSurvey.create({surveyId: 'my test surveyId 40', completed: 'today', _id: '53f3ab80432f102a2f06d340'}, function (err) {
        if (err) {
          return done(err);
        }

        CompletedSurvey.create({surveyId: 'my test surveyId 41', completed: 'tomorrow', _id: '53f3ab80432f102a2f06d341'}, function (err) {
          if (err) {
            return done(err);
          }
        });
      });

      supertest(server)
        .get('/completedSurveys')
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

          body[0].should.have.property('surveyId', 'my test surveyId 40');
          body[0].should.have.property('completed', 'today');

          body[1].should.have.property('surveyId', 'my test surveyId 41');
          body[1].should.have.property('completed', 'tomorrow');

          return done();
        });
    });
  });

  describe("GET byId", function () {
    beforeEach(function (done) {
      CompletedSurvey.create({surveyId: 'my test surveyId', completed: 'today', _id: '53f3ab80432f102a2f06d331'}, function (err) {
        return done(err);
      });
    });

    it("[404] Id is not found", function (done) {
      supertest(server)
        .get('/completedSurvey/53f3ab80432f102a2f06d330')
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
        .get('/completedSurvey/badId')
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

    it("[200] completedSurvey exists", function (done) {
      supertest(server)
        .get('/completedSurvey/53f3ab80432f102a2f06d331')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('object');

          body.should.have.property('surveyId', 'my test surveyId');
          body.should.have.property('completed', 'today');

          return done();
        });
    });
  });
});
