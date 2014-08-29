"use strict";

var passport = require("passport");

module.exports = function register(app) {
  app.get('/login', function (req, res) {
    res.render('login', {
      title: 'loginpage'
    });
  });
//  app.post('/login', function (req, res) {
//    if (req.body.zid.indexOf('z') === 0) {
//      res.redirect('/action');
//    } else {
//      res.redirect('/login');
//    }
//  });

  // this looks cool! route processing
//  app.post('/login', passport.authenticate('local', {
//      successRedirect: '/action',
//      failureRedirect: '/login' }
//  ));
  app.post('/login',
//    passport.authenticate('local'),
    // we do not need persistent sessions?
    passport.authenticate('basic', { session: false }),
    function (req, res) {
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
      res.redirect('/users/' + req.user.username);
    });
};
