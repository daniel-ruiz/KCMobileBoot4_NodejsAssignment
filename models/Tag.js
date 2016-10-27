'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uniqueValidator = require('mongoose-unique-validator');

let tagSchema = new Schema({
  name: {
    type: 'String',
    required: true,
    unique: true
  }
});

tagSchema.plugin(uniqueValidator);

const Tag = mongoose.model('Tag', tagSchema);