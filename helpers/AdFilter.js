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

  this.query = function() {
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

  this.options = function() {
    const page = parseInt(this.extractFromRequest('page'));
    const perPage = parseInt(this.extractFromRequest('perPage'));
    const sort = this.extractFromRequest('sort');

    let options = {
      select: {
        _id: 0,
        name: 1,
        type: 1,
        price: 1,
        photo: 1,
        tags: 1
      }
    };

    if (!isNaN(page) && !isNaN(perPage)) {
      options.page = page;
      options.limit = perPage;
    }

    if (sort) {
      options.sort = {};
      if (sort.startsWith('-')) {
        options.sort[sort.slice(1)] = -1;
      } else {
        options.sort[sort] = 1;
      }
    }

    return options;
  };

  return this;
}

module.exports = AdFilter;