"use strict";

var env = require('./env');
var mongoose = require('mongoose');

var uri = env.str('MONGOHQ_URL');

// Create the database connection
mongoose.connect(uri);

mongoose.connection.on('connected', function () {
  console.log("Mongoose default connection open to " + uri);
});

mongoose.connection.on('error', function (err) {
  console.log("Mongoose default connection error: " + err);
});

mongoose.connection.on('disconnected', function () {
  console.log("Mongoose default connection disconnected");
});

process.on('SIGINT', closeMongoose);
process.on('SIGTERM', closeMongoose);

function closeMongoose() {
  mongoose.connection.close(function () {
    console.log("Mongoose default connection disconnected through app termination");
    process.exit(0);
  });
}

/*
var MongoClient = require('mongodb').MongoClient;
var Q = require('q');
var env = require('./env');
var _ = require("lodash");

var _pooledConnection = null;

var pooledConnection = function () {
    var deferred = Q.defer();

    if (_pooledConnection) {
        console.log('returning pooled connection to MongoDB');

        deferred.resolve(_pooledConnection);
    } else {
        console.log('initiating connection to MongoDB');

        var uri = env.str('MONGOHQ_URL');

        MongoClient.connect(uri, function (err, db) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                console.log('completed connection to MongoDB');

                _pooledConnection = db;
                deferred.resolve(_pooledConnection);
            }
        });
    }

    return deferred.promise;
};

// normal CTRL-C exit
process.on('SIGINT', closePooledConnection);

// heroku uses SIGTERM to shutdown apps; 10 seconds then sends SIGKILL
// https://devcenter.heroku.com/articles/dynos#graceful-shutdown-with-sigterm
process.on('SIGTERM', closePooledConnection);

// If the Node process ends, close the Mongo connection pool
function closePooledConnection () {
    if (_pooledConnection) {
        console.log("closing connection pool to MongoDB");
        _pooledConnection.close(function () {
            console.info("closed connection pool to MongoDB");
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
}

module.exports = {
    pooledConnection: pooledConnection
};
*/
