"use strict";

exports.register = function (server) {
  require('./resources/root').register(server);
  require('./resources/survey').register(server);
};