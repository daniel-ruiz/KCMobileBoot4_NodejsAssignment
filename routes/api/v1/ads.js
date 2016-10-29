'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Ad = mongoose.model('Ad');

const Promise = mongoose.Promise;

router.get('/', function(req, res, next) {
  Ad.find({}).select({
    _id: 0,
    name: 1,
    type: 1,
    price: 1,
    photo: 1,
    tags: 1
  })
  .then(function(ads) {
    res.status(200).json({
      success: true,
      ads: ads
    });
  })
  .catch(next);
});

module.exports = router;