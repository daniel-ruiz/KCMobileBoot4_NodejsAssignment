'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Ad = mongoose.model('Ad');

const throwjs = require('throw.js');

router.get('/', function(req, res) {
  const tagNames = Ad.availableTags().map(function(tag) {
    return {name: tag};
  });

  res.status(200).json({
    status: 200,
    name: 'OK',
    message: 'Tags successfully retrieved',
    tags: tagNames
  });
});

router.all('/', function(req, res, next) {
  const message = `The ${req.method} method is not allowed for this resource`;
  next(new throwjs.methodNotAllowed(message));
});

module.exports = router;