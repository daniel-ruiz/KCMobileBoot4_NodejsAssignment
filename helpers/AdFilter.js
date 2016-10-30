'use strict';

const mongoose = require('mongoose');
const Ad = mongoose.model('Ad');

function flattenArray(array) {
  return [].concat.apply([], array);
}

function AdFilter(request) {
  this.request = request;

  this.extractFromRequest = function(name) {
    return this.request.query[name] || this.request.body[name];
  };

  this.toJson = function() {
    const name = this.extractFromRequest('name');
    const type = this.extractFromRequest('type');
    const minPrice = parseInt(this.extractFromRequest('minPrice'));
    const maxPrice = parseInt(this.extractFromRequest('maxPrice'));
    const tags = this.extractFromRequest('tags');

    let adFilter = {};
    if (name) {
      adFilter.name = {$regex: new RegExp('^' + name, 'i')};
    }
    if (type && Ad.isPermittedType(type.toUpperCase())) {
      adFilter.type = type.toUpperCase();
    }
    if (!isNaN(minPrice) && isNaN(maxPrice)) {
      adFilter.price = {$gte: minPrice};
    }
    if (isNaN(minPrice) && !isNaN(maxPrice)) {
      adFilter.price = {$lte: maxPrice};
    }
    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      adFilter.price = {$gte: minPrice, $lte: maxPrice};
    }
    if (tags) {
      adFilter.tags = {$in: flattenArray([tags])};
    }

    return adFilter;
  };

  return this;
}

module.exports = AdFilter;