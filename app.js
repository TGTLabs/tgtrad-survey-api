"use strict";

var dotenv = require('dotenv');
dotenv.load();

var thisPackage = require('./package');
var express = require("express");
var serveStatic = require('serve-static');
var morgan = require('morgan');
var compress = require('compression');
var bodyParser = require('body-parser');

// create server
var app = express();
app.set('title', thisPackage.description);

// configure logging
var loggingFormat = 'remote=:remote-addr ":method :url HTTP/:http-version" status=:status length=:res[content-length] responseTime=:response-time request_id=:req[X-Request-ID] referrer=":referrer" userAgent=":user-agent"';
app.use(morgan(loggingFormat));

// enable gzip compression
app.use(compress());

//enable body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// view engine setup
app.set('views', (__dirname + '/views'));
app.set('view engine', 'jade');

// setup routes
require('./routes/root')(app);
require('./routes/login')(app);
require('./routes/action')(app);
require('./routes/question')(app);
require('./routes/createSurvey')(app);

// static content
app.use('/build', serveStatic(__dirname + '/build'));

// start server
var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("%s, version %s. Listening on %s", app.get('title'), thisPackage.version, port);
});
