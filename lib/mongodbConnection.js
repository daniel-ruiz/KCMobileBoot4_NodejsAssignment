'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/nodepop');

const db = mongoose.connection;
db.on('error', console.log.bind(console, 'Cannot connect to database:'));
db.once('open', console.log.bind(console, 'Connected to MongoDB'));