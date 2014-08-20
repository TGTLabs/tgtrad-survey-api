/* jshint strict: false, expr: true */
/* global describe */

var should = require('chai').should();
var supertest = require('supertest');

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var Survey = require('../../models/survey');
var server = require('../../lib/server')('mocha-test-server');
require('../../api/resources/survey').register(server);

describe("/survey resources", function () {
  beforeEach(function (done) {
    mockgoose.reset();
    return done();
  });

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
        .send({name: 'my test name CREATED', campaign: "some new campaign", owner: "donnie"})
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
      Survey.create({name: 'my test name', owner: 'donnie', campaign: "some campaign", _id: '53f3ab80432f102a2f06d401'}, function (err) {
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
          body.should.have.property('campaign', 'some campaign');

          // confirm patched
          Survey.findById("53f3ab80432f102a2f06d401", function (err, survey) {
            survey.should.have.property('name', 'my test name PATCHED');
            survey.should.have.property('owner', 'donnie');
            survey.should.have.property('campaign', 'some campaign');

            return done();
          });
        });
    });
  });

  describe("PUT byId", function () {
    beforeEach(function (done) {
      Survey.create({name: 'my test name', owner: 'donnie', campaign: "should be gone after put", _id: '53f3ab80432f102a2f06d391'}, function (err) {
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
        .put('/survey/53f3ab80432f102a2f06d391')
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
        .put('/survey/53f3ab80432f102a2f06d391')
        .send({name: 'my test name UPDATED', owner: 'donnie'})
        .set('Accept', 'application/json')
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
          body.should.not.have.property('campaign');

          // confirm updated
          Survey.findById("53f3ab80432f102a2f06d391", function (err, survey) {
            survey.should.have.property('name', 'my test name UPDATED');
            survey.should.have.property('owner', 'donnie');
            survey.should.not.have.property('campaign');

            return done();
          });
        });
    });
  });

  describe("DELETE byId", function () {
    beforeEach(function (done) {
      Survey.create({name: 'my test name', owner: 'donnie', _id: '53f3ab80432f102a2f06d381'}, function (err) {
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
        .delete('/survey/53f3ab80432f102a2f06d381')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('object');

          body.should.have.property('name', 'my test name');
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
      Survey.create({name: 'my test name 40', owner: 'donnie', _id: '53f3ab80432f102a2f06d340'}, function (err) {
        if (err) {
          return done(err);
        }

        Survey.create({name: 'my test name 41', owner: 'donnie', _id: '53f3ab80432f102a2f06d341'}, function (err) {
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

          body[0].should.have.property('name', 'my test name 40');
          body[0].should.have.property('owner', 'donnie');

          body[1].should.have.property('name', 'my test name 41');
          body[1].should.have.property('owner', 'donnie');

          return done();
        });
    });
  });

  describe("GET byId", function () {
    beforeEach(function (done) {
      Survey.create({name: 'my test name', owner: 'donnie', _id: '53f3ab80432f102a2f06d331'}, function (err) {
        return done(err);
      });
    });

    it("[404] Id is not found", function (done) {
      supertest(server)
        .get('/survey/53f3ab80432f102a2f06d330')
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
        .get('/survey/53f3ab80432f102a2f06d331')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('object');

          body.should.have.property('name', 'my test name');
          body.should.have.property('owner', 'donnie');

          return done();
        });
    });
  });
});