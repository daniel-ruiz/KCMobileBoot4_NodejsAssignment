'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const User = mongoose.model('User');

router.post('/', function(req, res) {
  let newUser = new User(req.body);

  newUser.save(function(err, savedUser) {
    if (err) {
      for (let key in err.errors) {
        if (err.errors.hasOwnProperty(key)) {
          err.errors[key] = {
            message: err.errors[key].message
          };
        }
      }
      return res.json(err);
    }

    res.json({
      success: true,
      user: {
        name: savedUser.name,
        email: savedUser.email
      }
    });
  });
});

module.exports = router;
