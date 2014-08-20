"use strict";

var server = require('./lib/server');
var thisPackage = require('./package');
var db = require('./lib/db');

/*********************
 *  REST Endpoints
 *********************/
require('api').register(server.restify);

// START SERVER
var port = process.env.PORT || 5000;
server.restify.listen(port, function () {
  console.log("%s, version %s. Listening on %s", thisPackage.description, thisPackage.version, port);
});
