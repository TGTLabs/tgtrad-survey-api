"use strict";

var isemail = require("isemail");

module.exports = {
  stringLengthValidator : function stringLengthValidator (min, max) {
    return function (v) {
      return v && v.length >= min && v.length <= max;
    };
  },

  isEmail : function isEmail(emailAddress) {
    return isemail(emailAddress, {checkDNS: true});
  }
};