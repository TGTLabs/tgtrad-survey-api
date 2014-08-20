"use strict";

var pkg = require('../../package');

/*********************
 *  REST Endpoints
 *********************/
function register(server) {
  server.get("/", getVersion);
}

/*********************
 *  Resource functions
 *********************/
var getVersion = function (req, res, next) {
  res.cache('public', { maxAge: 300});
  res.send({ name: pkg.name, version: pkg.version});

  return next();
};

/*********************
 *  Helper Functions
 *********************/

module.exports = {
  register: register
};
