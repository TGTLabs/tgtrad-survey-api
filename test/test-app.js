/* jshint strict: false, expr: true */
/* global describe */

var should = require('chai').should();
var supertest = require('supertest');

require('../models');
var server = require('../lib/server').restify;
require('../api').register(server);

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var Survey = mongoose.model('Survey');

describe("API endpoints", function () {
  beforeEach(function (done) {
    mockgoose.reset();
    Survey.create({name: 'my test name', owner: 'donnie', _id: '53f3ab80432f102a2f06d331'}, function(err, model) {
      return done(err);
    });
  });

  describe("/", function () {
    it("GET 200", function (done) {
      supertest(server)
        .get('/')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Cache-Control', "public, max-age=300")
        .end(function (err, response) {
          if (err) {
            return done(err);
          }

          var body = response.body;
          body.should.be.an('object');

          body.should.have.property('name');
          body.should.have.property('version');

          return done();
        });
    });
  });

  describe("/survey", function () {
    it("GET 200 byId", function (done) {
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