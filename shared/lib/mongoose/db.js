"use strict";

var env = require('./../env');
var mongoose = require('mongoose');

var uri = env.str('TGTRAD_MONGODB_URL');

// Create the database connection
mongoose.connect(uri);

mongoose.connection.on('connected', function () {
  console.log("Mongoose connection open to " + uri);
});

mongoose.connection.on('error', function (err) {
  console.log("Mongoose connection error: " + err);
});

mongoose.connection.on('disconnected', function () {
  console.log("Mongoose connection disconnected");
});

process.on('SIGINT', closeMongoose);
process.on('SIGTERM', closeMongoose);

function closeMongoose() {
  mongoose.connection.close(function () {
    console.log("Mongoose default connection disconnected through app termination");
    process.exit(0);
  });
}
