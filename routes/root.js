"use strict";

module.exports = function register(app) {
    app.get('/', function(req, res) {
        res.redirect('/login');
    });
};
