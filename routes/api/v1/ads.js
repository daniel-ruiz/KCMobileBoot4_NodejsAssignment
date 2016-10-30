'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Ad = mongoose.model('Ad');
const AdFilter = require('../../../helpers/AdFilter');

const throwjs = require('throw.js');

router.get('/', function(req, res, next) {
  const adFilter = new AdFilter(req);

  Ad.paginate(adFilter.query(), adFilter.options())
  .then(function(ads) {
    res.status(200).json({
      status: 200,
      name: 'OK',
      message: 'Ads successfully retrieved',
      ads: ads.docs,
      total: ads.total,
      perPage: ads.limit,
      page: ads.page,
      pages: ads.pages
    });
  })
  .catch(next);
});

router.all('/', function(req, res, next) {
  const message = `The ${req.method} method is not allowed for this resource`;
  next(new throwjs.methodNotAllowed(message));
});

module.exports = router;