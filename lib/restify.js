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

    // var crypted = 'e57457ae07e5ed1ff8d819bc043ce0358526f722e86669bcad774c8a084bcf69137d80358cf7a0fc3f388a3c1cbb2bc5dcf1b4bde761829ef385c4a44c119de463bfd2a6692f08bca21966bda681ecdfc245af4644766f2e78e785e71b73b2c23b50177c31063d613df0f6023e91d0c9143f5291d93a5df62e630f371b3e58ad';
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
    if (parseText.retryAuth == "now") {
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
