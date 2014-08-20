"use strict";

module.exports = function register(app) {
  app.get('/login', function (req, res) {
    res.render('login', {
      title: 'loginpage'
    });
  });
  app.post('/login', function (req, res) {
    if (req.body.zid.indexOf('z') === 0) {
      res.redirect('/action');
    } else {
      res.redirect('/login');
    }
  });
};
