"use strict";

// perform environment variable initialization as soon as possible so other libraries may benefit
var dotenv = require('dotenv');
dotenv.load();

var thisPackage = require('./package');
var server = require('./lib/restify')(thisPackage.description);

// INIT DB Connection
require('./shared/lib/mongoose/db');

// SETUP THE MODELS
require('./shared/models');

var restifyMongoose = require('restify-mongoose');

/*********************
 *  REST Endpoints
 *********************/
require('./api').register(server);

// START SERVER
var port = process.env.PORT || 5000;
server.listen(port, function () {
  console.log("%s, version %s. Listening on %s", server.name, thisPackage.version, port);
});
