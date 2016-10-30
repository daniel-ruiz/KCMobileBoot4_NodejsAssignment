'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const User = mongoose.model('User');

const jwt = require('jsonwebtoken');
const throwjs = require('throw.js');

router.post('/', function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  if (email && password) {
    User.findOne({ email: email }, function(err, user) {
      if (err || !user) {
        if (err) {
          console.log(err);
        }
        const message = 'Invalid email and password';
        const errorResponse = new throwjs.badRequest(message);
        return res.status(400).json({
          status: errorResponse.statusCode,
          name: errorResponse.name,
          message: errorResponse.message
        });
      }
      user.comparePassword(password, function(err, isMatch) {
        if (err || !isMatch) {
          if (err) {
            console.log(err);
          }
          const message = 'Invalid email and password';
          const errorResponse = new throwjs.badRequest(message);
          return res.status(400).json({
            status: errorResponse.statusCode,
            name: errorResponse.name,
            message: errorResponse.message
          });
        }

        const jwtToken = jwt.sign({
          name: user.name,
          email: user.email
        }, 'ghFwBnLYeYn8pvJH');

        res.status(201).json({
          status: 201,
          name: 'Created',
          message: 'Logged in successfully',
          token: jwtToken
        });
      });

    });
  } else {
    const message = 'Email and password fields required';
    const err = new throwjs.unprocessableEntity(message);
    res.status(422).json({
      status: err.statusCode,
      name: err.name,
      message: err.message
    });
  }

});

router.all('/', function(req, res, next) {
  const message = `The ${req.method} method is not allowed for this resource`;
  next(new throwjs.methodNotAllowed(message));
});

module.exports = router;