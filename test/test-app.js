/* jshint strict: false, expr: true */
/* global describe */

var should = require('chai').should();
var supertest = require('supertest');

var server = require('../lib/server').restify;

describe("API endpoints", function () {
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
});