"use strict";

// perform environment variable initialization as soon as possible so other libraries may benefit
var dotenv = require('dotenv');
var passport = require('passport');
var User = require('./shared/models/User.js');
var GoogleStrategy = require('passport-google').Strategy;

dotenv.load();

var thisPackage = require('./package');
var server = require('./lib/restify')(thisPackage.description);

// INIT DB Connection
require('./shared/lib/mongoose/db');

// SETUP THE MODELS
require('./shared/models');

var restifyMongoose = require('restify-mongoose');

server.use(passport.initialize());
server.use(passport.session());

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
    realm: 'http://localhost:5000/'
  },
  function(identifier, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

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

server.get("/eh", getVersion);

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve redirecting
//   the user to google.com.  After authenticating, Google will redirect the
//   user back to this application at /auth/google/return
server.get('/auth/google',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

// GET /auth/google/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
server.get('/auth/google/return',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.send('did something');
    res.redirect('/');
  });
/*********************
 *  Resource functions
 *********************/
function getVersion (req, res, next) {
  res.cache('public', { maxAge: 300});
  res.send({ name: "eh", version: "pkg.version"});

  next();
}

// START SERVER
var port = process.env.PORT || 5000;
server.listen(port, function () {
  console.log("%s, version %s. Listening on %s", server.name, thisPackage.version, port);
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
