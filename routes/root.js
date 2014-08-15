"use strict";

var pkg = require('../package');

/*********************
 *  REST Endpoints
 *********************/
var getVersion = function (req, res, next) {
    var stopProfile = req.metrics.metric.profile("api.root.get");

    res.cache('public', { maxAge: 300});
    res.send({ name: pkg.name, version: pkg.version});

    stopProfile();

    return next();
};

module.exports = {
    getVersion: getVersion
};

