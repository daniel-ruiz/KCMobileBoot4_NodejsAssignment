'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Ad = mongoose.model('Ad');
const AdFilter = require('../../../helpers/AdFilter');

router.get('/', function(req, res, next) {
  const adFilter = new AdFilter(req);

  Ad.paginate(adFilter.query(), adFilter.options())
  .then(function(ads) {
    res.status(200).json({
      success: true,
      ads: ads.docs,
      total: ads.total,
      perPage: ads.limit,
      page: ads.page,
      pages: ads.pages
    });
  })
  .catch(next);
});

module.exports = router;