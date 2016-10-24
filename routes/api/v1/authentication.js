'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const User = mongoose.model('User');

const jwt = require('jsonwebtoken');

router.post('/', function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  if (email && password) {
    User.findOne({ email: email }, function(err, user) {
      if (err || !user) {
        if (err) {
          console.log(err);
        }
        return res.status(400).json({
          success: false,
          message: 'Invalid email and password'
        });
      }
      user.comparePassword(password, function(err, isMatch) {
        if (err || !isMatch) {
          if (err) {
            console.log(err);
          }
          return res.status(400).json({
            success: false,
            message: 'Invalid email and password'
          });
        }

        const jwtToken = jwt.sign({
          name: user.name,
          email: user.email
        }, 'ghFwBnLYeYn8pvJH');

        res.json({
          success: true,
          message: 'Logged in successfully',
          token: jwtToken
        });
      });

    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Email and password fields required'
    });
  }

});

module.exports = router;