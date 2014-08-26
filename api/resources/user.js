"use strict";

var mongoose = require("mongoose");
var User = mongoose.model('User');
var _ = require("lodash");

/*********************
 *  REST Endpoints
 *********************/
function register(server) {
  server.get("/users", getUsers);
  server.get("/user/:id", getUserById);
  server.post("/user", postUser);
  server.del("/user/:id", removeUserById);
  server.put("/user/:id", updateUserById);
  server.patch("/user/:id", patchUserById);
}

/*********************
 *  Resource functions
 *********************/

var getUserById = function(req, res, next) {
  res.cache('public', {
    maxAge: 300
  });

  User.findById(req.params.id).lean().exec(function(err, user) {
    if (err) {
      res.status(400);
      if (err.name && err.name === "CastError") {
        res.send({
          message: 'Bad id'
        });
      } else {
        res.send({
          message: err.message
        });
      }
    } else if (!user) {
      res.status(404);
      res.send({
        message: "Not found"
      });
    } else {
      res.send(user);
    }

    return next();
  });
};

var getUsers = function(req, res, next) {
  res.cache('public', {
    maxAge: 300
  });

  User.find({}).lean().exec(function(err, users) {
    if (err) {
      res.status(400);
      res.send({
        message: err.message
      });
    } else if (!users) {
      res.status(404);
      res.send({
        message: "Not found"
      });
    } else {
      res.send(users);
    }

    return next();
  });
};

var postUser = function(req, res, next) {
  res.cache('public', {
    maxAge: 300
  });

  if (!req.body) {
    res.status(400);
    res.send({
      message: 'Missing body'
    });

    return next();
  }

  var newUser = {
    userId: req.body.userId,
    email: req.body.email,
    balance: req.body.balance,
    password: req.body.password,
    score: req.body.score,
    history: req.body.history
  };
  var user = new User(newUser);
  var validateErr = user.joiValidate(user).error;

  if (validateErr === null) {
    User.create(newUser, function(err, user) {
      if (err) {
        res.status(400);
        res.send({
          message: err.message
        });
      } else {
        res.status(201);
        res.send(user);
      }

      return next();
    });
  } else {
    res.status(406);
    res.send(validateErr);
    return next();
  }
};

var removeUserById = function(req, res, next) {
  res.cache('public', {
    maxAge: 300
  });

  User.findByIdAndRemove(req.params.id).lean().exec(function(err,
    user) {
    if (err) {
      res.status(400);
      if (err.name && err.name === "CastError") {
        res.send({
          message: 'Bad id'
        });
      } else {
        res.send({
          message: err.message
        });
      }
    } else if (!user) {
      res.status(404);
      res.send({
        message: "Not found"
      });
    } else {
      res.send(user);
    }
    return next();
  });
};

var updateUserById = function(req, res, next) {
  res.cache('public', {
    maxAge: 300
  });

  if (!req.body) {
    res.status(400);
    res.send({
      message: 'Missing body'
    });

    return next();
  }

  User.findById(req.params.id, function(err, user) {
    if (err) {
      res.status(400);
      if (err.name && err.name === "CastError") {
        res.send({
          message: 'Bad id'
        });
      } else {
        res.send({
          message: err.message
        });
      }
    } else if (!user) {
      res.status(404);
      res.send({
        message: "Not found"
      });
    } else {

      // set the data from the request onto the existing object
      user.userId = req.body.userId;
      user.email = req.body.email;
      user.balance = req.body.balance;
      user.password = req.body.password;
      user.score = req.body.score;
      user.history = req.body.history;

      var validateErr = user.joiValidate(user).error;
      if (validateErr === null) {
        user.save(function(err, user) {
          if (err) {
            res.status(400);
            res.send({
              message: err.message
            });
          } else {
            res.send(user);
          }

          return next();
        });
      } else {
        res.status(406);
        res.send(validateErr);
        return next();
      }
    }

    return next();
  });
};

var patchUserById = function(req, res, next) {
  res.cache('public', {
    maxAge: 300
  });

  if (!req.body) {
    res.status(400);
    res.send({
      message: 'Missing body'
    });

    return next();
  }

  User.findById(req.params.id, function(err, user) {
    if (err) {
      res.status(400);
      if (err.name && err.name === "CastError") {
        res.send({
          message: 'Bad id'
        });
      } else {
        res.send({
          message: err.message
        });
      }
    } else if (!user) {
      res.status(404);
      res.send({
        message: "Not found"
      });
    } else {
      // set the data from the request onto the existing object
      patchField(user, "userId", req.body.userId);
      patchField(user, "email", req.body.email);
      patchField(user, "balance", req.body.balance);
      patchField(user, "password", req.body.password);
      patchField(user, "score", req.body.score);
      patchField(user, "history", req.body.history);

      var validateErr = user.joiValidate(user).error;
      if (validateErr === null) {
        user.save(function(err, user) {
          if (err) {
            res.status(400);
            res.send({
              message: err.message
            });
          } else {
            res.send(user);
          }

          return next();
        });
      } else {
        res.status(406);
        res.send(validateErr);
        return next();
      }
    }

    return next();
  });
};

var patchField = function(object, fieldName, value) {
  if (_.isNull(value)) {
    object[fieldName] = undefined;
  } else if (value) {
    object[fieldName] = value;
  }
};

module.exports = {
  register: register
};
