'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Ad = mongoose.model('Ad');

router.get('/', function(req, res) {
  res.status(200).json({
    success: true,
    tags: Ad.availableTags()
  });
});

module.exports = router;