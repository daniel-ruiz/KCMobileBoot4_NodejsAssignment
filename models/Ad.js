'use strict';

const uniq = require('lodash.uniq');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PERMITTED_AD_TYPES = ['BUY', 'SELL'];
const PERMITTED_TAGS = ['work', 'lifestyle', 'motor', 'mobile'];

function tagValueValidator(tags) {
  for (let i = 0; i < tags.length; i++) {
    if (PERMITTED_TAGS.indexOf(tags[i]) === -1) {
      return false;
    }
  }

  return true;
}

let adSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: PERMITTED_AD_TYPES
  },
  price: {
    type: Number,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    required: true,
    validate: [tagValueValidator, 'The Ad contains at least one invalid tag']
  }
});

adSchema.pre('save', function(next) {
  let ad = this;

  ad.tags = uniq(ad.tags);

  next();
});

adSchema.statics.availableTags = function() {
  return PERMITTED_TAGS;
};

adSchema.statics.permittedTypes = function() {
  return PERMITTED_AD_TYPES;
};

adSchema.statics.isPermittedType = function(type) {
  return PERMITTED_AD_TYPES.indexOf(type) !== -1;
};

mongoose.model('Ad', adSchema);