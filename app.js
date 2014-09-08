"use strict";

// perform environment variable initialization as soon as possible so other libraries may benefit
var dotenv = require('dotenv');
var passport = require('passport');
var User = require('./shared/models/User.js');
var GoogleStrategy = require('passport-google').Strategy;
var crypto = require('crypto');

dotenv.load();



var thisPackage = require('./package');
var server = require('./lib/restify')(thisPackage.description);

// INIT DB Connection
require('./shared/lib/mongoose/db');

// SETUP THE MODELS
require('./shared/models');

var restifyMongoose = require('restify-mongoose');

server.use(passport.initialize());
// server.use(passport.session());

// passport.serializeUser(User.serializeUser);
// passport.deserializeUser(User.deserializeUser);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});



passport.use(new GoogleStrategy({
    returnURL: 'http://localhost:5000/auth/google/return',
    realm: 'http://localhost:5000/',
    stateless: true,
    pape: {
      maxAuthAge: 600
    }
  },
  function(identifier, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function() {

      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      profile.identifier = identifier;
       return done(null, profile);
    });
  }
));


/*********************
 *  REST Endpoints
 *********************/
require('./api').register(server);


// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve redirecting
//   the user to google.com.  After authenticating, Google will redirect the
//   user back to this application at /auth/google/return
server.get('/auth/google',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    res.redirect('/');
  });


server.get("/test", passport.authenticate('google', {
  session: false
}), function(req, res, next) {
  res.send("authenticated");
});

// server.get("/test",isAuthenticated, function(req,res,next){
// console.log("got here yo");
// res.send("authenticated");
// });

// GET /auth/google/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
server.get('/auth/google/return',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  function(req, res) {

    res.send(req.user.identifier);
    //write email to user database
    //search database for
    //fulfill initial request if there was one ()
    var cipher = crypto.createCipher('aes-256-cbc','FortunaMajor');
    var xKey = {
      identity: req.user.identifier,
      retryAuth: "now"
    };
    var xKeyString = JSON.stringify(xKey);
    var crypted = cipher.update(xKeyString,'utf8','hex');
    crypted += cipher.final('hex');
    res.send(crypted);
    var decipher = crypto.createDecipher('aes-256-cbc','FortunaMajor');
    var dec = decipher.update(crypted,'hex','utf8');
    dec += decipher.final('utf8');
    var parseText = JSON.parse(dec);

    // console.log(dec);
  });


// START SERVER
var port = process.env.PORT || 5000;
server.listen(port, function() {
  console.log("%s, version %s. Listening on %s", server.name, thisPackage.version,
    port);
});


function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    next(new Error(401));
  }
}
