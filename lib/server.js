"use strict";

// perform environment variable initialization as soon as possible so other libraries may benefit
var dotenv = require('dotenv');
dotenv.load();

var env = require('./env');
var assert = require("assert");
var root = require('../resources/root');
var Restify = require('restify');

// Initialize the server
var restify = Restify.createServer();

if (env.bool('TGTRAD_CORS_ENABLED') === 'true') {
    var corsOrigins = env.str('TGTRAD_CORS_ORIGINS');
    assert(corsOrigins, "Missing CORS origins env variable.");
    corsOrigins = corsOrigins.split(',');
    restify.pre(Restify.CORS({
        origins: corsOrigins
    }));
}

/*********************
 *  RESTIFY configuration
 *********************/
restify.use(Restify.acceptParser(restify.acceptable));
restify.use(Restify.gzipResponse());
restify.use(Restify.queryParser());

// EVENTS
restify.on('uncaughtException', exceptionTrapper);

/*********************
 *  REST Endpoints
 *********************/
restify.get("/", root.getVersion);

/*********************
 *  HELPER Functions
 *********************/
function exceptionTrapper(req, res, route, err) {
    var requestId = req.header('X-Request-ID') || '[none]';

    console.error('request_id=%s "%s"', requestId, err.stack);
    res.send(new Restify.InternalError("Ah CRAP! " + requestId));
}

module.exports = {
    restify: restify
};

