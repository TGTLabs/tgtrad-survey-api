/* jshint strict: false, expr: true */
/* global describe */

var should = require('chai').should();
var supertest = require('supertest');

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var User = require('../../models/user');
var server = require('../../lib/server')('mocha-test-server');
require('../../api/resources/user').register(server);

describe("/user resources", function () {
  beforeEach(function (done) {
    mockgoose.reset();
    return done();
  });

  describe("POST", function () {
    it("[400] payload missing", function (done) {
      supertest(server)
        .post('/user')
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
        .post('/user')
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
        .post('/user')
        .send({userId: 'my test userId CREATED', email: "some new email", balance: 8})
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

          body.should.have.property('userId', 'my test userId CREATED');
          body.should.have.property('email', 'some new email');
          body.should.have.property('balance', 8);
          body.should.have.property('_id');

          // confirm created
          User.findById(body._id, function (err, user) {
            user.should.have.property('userId', 'my test userId CREATED');
            user.should.have.property('email', 'some new email');
            user.should.have.property('balance', 8);

            return done();
          });
        });
    });
  });

  describe("PATCH byId", function () {
    beforeEach(function (done) {
      User.create({userId: 'my test userId PATCHED', email: "email", balance: 8, _id: '53f3ab80432f102a2f06d401'}, function (err) {
        return done(err);
      });
    });

    it("[404] Id is not found", function (done) {
      supertest(server)
        .patch('/user/53f3ab80432f102a2f06d330')
        .send({userId: 'my test userId UPDATED', email: 'email'})
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
        .patch('/user/bad_id')
        .send({userId: 'my test userId UPDATED', email: 'email'})
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
        .patch('/user/53f3ab80432f102a2f06d401')
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
        .patch('/user/53f3ab80432f102a2f06d401')
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

          body.should.have.property('userId', 'my test userId PATCHED');
          body.should.have.property('email', 'email');
          body.should.have.property('balance', 8);

          // confirm patched
          User.findById("53f3ab80432f102a2f06d401", function (err, user) {
            user.should.have.property('userId', 'my test userId PATCHED');
            user.should.have.property('email', 'email');
            user.should.have.property('balance', 8);

            return done();
          });
        });
    });
  });

  describe("PUT byId", function () {
    beforeEach(function (done) {
      User.create({userId: 'my test userId', email: 'email', balance: 12, _id: '53f3ab80432f102a2f06d391'}, function (err) {
        return done(err);
      });
    });

    it("[404] Id is not found", function (done) {
      supertest(server)
        .put('/user/53f3ab80432f102a2f06d330')
        .send({userId: 'my test userId UPDATED', email: 'email'})
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
        .put('/user/bad_id')
        .send({userId: 'my test userId UPDATED', email: 'email'})
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
        .put('/user/53f3ab80432f102a2f06d391')
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
        .put('/user/53f3ab80432f102a2f06d391')
        .send({userId: 'my test userId UPDATED', email: 'email'})
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('object');

          body.should.have.property('userId', 'my test userId UPDATED');
          body.should.have.property('email', 'email');
          body.should.not.have.property('balance');

          // confirm updated
          User.findById("53f3ab80432f102a2f06d391", function (err, user) {
            user.should.have.property('userId', 'my test userId UPDATED');
            user.should.have.property('email', 'email');
            user.should.not.have.property('balance');

            return done();
          });
        });
    });
  });

  describe("DELETE byId", function () {
    beforeEach(function (done) {
      User.create({userId: 'my test userId', email: 'email', _id: '53f3ab80432f102a2f06d381'}, function (err) {
        return done(err);
      });
    });

    it("[404] Id is not found", function (done) {
      supertest(server)
        .delete('/user/53f3ab80432f102a2f06d330')
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
        .delete('/user/bad_id')
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
        .delete('/user/53f3ab80432f102a2f06d381')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('object');

          body.should.have.property('userId', 'my test userId');
          body.should.have.property('email', 'email');

          // confirm deletion
          User.findById("53f3ab80432f102a2f06d381", function (err, user) {

            should.not.exist(user);

            return done();
          });
        });
    });
  });

  describe("GET all", function () {
    it("[200] no users empty array", function (done) {
      supertest(server)
        .get('/users')
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

    it("[200] all users", function (done) {
      User.create({userId: 'my test userId 40', email: 'email', _id: '53f3ab80432f102a2f06d340'}, function (err) {
        if (err) {
          return done(err);
        }

        User.create({userId: 'my test userId 41', email: 'email2', _id: '53f3ab80432f102a2f06d341'}, function (err) {
          if (err) {
            return done(err);
          }
        });
      });

      supertest(server)
        .get('/users')
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

          body[0].should.have.property('userId', 'my test userId 40');
          body[0].should.have.property('email', 'email');

          body[1].should.have.property('userId', 'my test userId 41');
          body[1].should.have.property('email', 'email2');

          return done();
        });
    });
  });

  describe("GET byId", function () {
    beforeEach(function (done) {
      User.create({userId: 'my test userId', email: 'email', _id: '53f3ab80432f102a2f06d331'}, function (err) {
        return done(err);
      });
    });

    it("[404] Id is not found", function (done) {
      supertest(server)
        .get('/user/53f3ab80432f102a2f06d330')
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
        .get('/user/badId')
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

    it("[200] user exists", function (done) {
      supertest(server)
        .get('/user/53f3ab80432f102a2f06d331')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('object');

          body.should.have.property('userId', 'my test userId');
          body.should.have.property('email', 'email');

          return done();
        });
    });
  });
});
