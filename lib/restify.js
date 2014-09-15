"use strict";

var env = require('../shared/lib/env');
var Restify = require('restify');
var crypto = require('crypto');

module.exports = function init(serverName) {
  // Initialize the server
  var restify = Restify.createServer({name: serverName});

  if (env.bool('TGTRAD_CORS_ENABLED', {required: false}) === true) {
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
  restify.use(Restify.jsonBodyParser());
  restify.use(Restify.queryParser());
  restify.use(verifyApiKey);

  function verifyApiKey(req, res, next) {
    // every route but auth secured
    if (req.path().indexOf('/auth') < 0) {

    var parseText;
    try {
      var crypted = req.header('X-KEY');
      var decipher = crypto.createDecipher('aes-256-cbc','FortunaMajor');
      var dec = decipher.update(crypted,'hex','utf8');
      dec += decipher.final('utf8');
      parseText = JSON.parse(dec);
    } catch (err) {
      console.log("bad crypt");
      parseText = {retryAuth: "401"};
    }

    // check header for unexpired key
    var nowAuth = new Date().getTime();
    if (nowAuth <= parseText.retryAuth) {
      next();
    } else {
      next (new Error(401));
    }
  } else {
    next();
  }
  }




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

  return restify;
};
