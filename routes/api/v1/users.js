'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const User = mongoose.model('User');

const throwjs = require('throw.js');

router.post('/', function(req, res) {
  let newUser = new User(req.body);

  newUser.save(function(err, savedUser) {
    if (err) {
      if (err.errors) {
        for (let key in err.errors) {
          if (err.errors.hasOwnProperty(key)) {
            err.errors[key] = {
              message: err.errors[key].message
            };
          }
        }
      }

      let validationError = new throwjs.unprocessableEntity(err.message);
      validationError.errors = err.errors;
      return res.status(422).json({
        status: validationError.statusCode,
        name: validationError.name,
        message: validationError.message,
        errors: validationError.errors
      });
    }

    res.status(201).json({
      status: 201,
      name: 'Created',
      message: 'User successfully created',
      user: {
        name: savedUser.name,
        email: savedUser.email
      }
    });
  });
});

router.all('/', function(req, res, next) {
  const message = `The ${req.method} method is not allowed for this resource`;
  next(new throwjs.methodNotAllowed(message));
});

module.exports = router;
