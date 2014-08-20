/* jshint strict: false, expr: true */
/* global describe */

var should = require('chai').should();
var supertest = require('supertest');
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var server = require('../lib/server').restify;
var Survey = require('../domain/survey');
require('../api').register(server);

describe("API endpoints", function () {
  // MOCK DB
//  beforeEach(function (done) {
//    mockgoose.reset();
//
//    new Survey({name: 'my test name', _id: '53f393286ac59cd02aa379b7'}).save();
//  });

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
        .get('/survey/someId')
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
          body.should.have.property('owner');

          return done();
        });
    });
  });
});