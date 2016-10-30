'use strict';

const mongoose = require('mongoose');
const Ad = mongoose.model('Ad');

const faker = require('faker');
const sample = require('lodash.sample');
const sampleSize = require('lodash.samplesize');
const random = require('lodash.random');

function AdSample() {
  this.name = faker.lorem.sentence();
  this.type = sample(Ad.permittedTypes());
  this.price = faker.random.number();
  this.photo = faker.image.imageUrl();
  const availableTags = Ad.availableTags();
  this.tags = sampleSize(availableTags, random(1, availableTags.length));

  this.jsonSchema = {
    name: this.name,
    type: this.type,
    price: this.price,
    photo: this.photo,
    tags: this.tags
  };

  this.build = function() { return new Ad(this.jsonSchema); };

  this.create = function(callback) { this.build().save(callback); };

  return this;
}

module.exports = AdSample;