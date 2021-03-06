'use strict';

const uniq = require('lodash.uniq');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
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
    required: [true, 'The ad must have a name'],
    index: true
  },
  type: {
    type: String,
    enum: {
      values: PERMITTED_AD_TYPES,
      message: 'Invalid ad type',
    },
    index: true
  },
  price: {
    type: Number,
    required: [true, 'The ad must have a price'],
    index: true
  },
  photo: {
    type: String,
    required: [true, 'The ad must have a photo'],
    index: true
  },
  tags: {
    type: [String],
    required: [true, 'The ad must have at least one valid tag'],
    validate: [tagValueValidator, 'The ad contains at least one invalid tag'],
    index: true
  }
});

adSchema.plugin(mongoosePaginate);

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