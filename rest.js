"use strict";

// perform environment variable initialization as soon as possible so other libraries may benefit
var dotenv = require('dotenv');
dotenv.load();

var server = require('./lib/server');
var thisPackage = require('./package');

// INIT DB Connection
require('./lib/db');

// SETUP THE MODELS
require('./models');

// ADD THE ENDPOINTS
require('./api').register(server.restify);

// START SERVER
var port = process.env.PORT || 5000;
server.restify.listen(port, function () {
  console.log("%s, version %s. Listening on %s", thisPackage.description, thisPackage.version, port);
});
