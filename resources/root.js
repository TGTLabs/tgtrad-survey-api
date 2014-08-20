"use strict";

var pkg = require('../package');

/*********************
 *  REST Endpoints
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
  getVersion: getVersion
};

