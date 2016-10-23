'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const Promise = mongoose.Promise;

const Schema = mongoose.Schema;

let userSchema = new Schema({
  name: {
    type: 'String',
    required: true
  },
  email: {
    type: 'String',
    required: true,
    unique: true
  },
  password: {
    type: 'String',
    required: true,
    minlength: 8
  }
});

userSchema.plugin(uniqueValidator);

userSchema.pre('save', function(next) {
  let user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      console.log('[BCRYPT] Could not generate salt:' + err);
      return next(err);
    }

    bcrypt.hash(user.password, salt, function(err, hashedPassword) {
      if (err) {
        console.log('[BCRYPT] Could not hash user password:', err);
        return next(err);
      }

      user.password = hashedPassword;
      next();
    });
  });

});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  const user = this;

  bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }

    callback(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);