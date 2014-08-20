"use strict";

var env = require('./env');
var Restify = require('restify');

// Initialize the server
var restify = Restify.createServer();

if (env.bool('TGTRAD_CORS_ENABLED', {required: false}) === 'true') {
    var origins = env.str('TGTRAD_CORS_ORIGINS').split(',');
    restify.pre(Restify.CORS({
        origins: origins
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

