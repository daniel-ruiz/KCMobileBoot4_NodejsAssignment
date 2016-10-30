'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const throwjs = require('throw.js');

require('./lib/mongodbConnection');
const isApiRequest = require('./lib/checkApiRequest');

require('./models/User');
require('./models/Ad');

const routes = require('./routes/index');
const users = require('./routes/api/v1/users');
const authentication = require('./routes/api/v1/authentication');
const tags = require('./routes/api/v1/tags');
const ads = require('./routes/api/v1/ads');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(jwt({ secret: 'ghFwBnLYeYn8pvJH' })
  .unless({
    path: [
      '/',
      {
        url: '/api/v1/users',
        methods: ['POST']
      },
      {
        url: '/api/v1/login',
        methods: ['POST']
      }
    ]
  }));

app.use('/', routes);
app.use('/api/v1/users', users);
app.use('/api/v1/login', authentication);
app.use('/api/v1/tags', tags);
app.use('/api/v1/ads', ads);

app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    next(new throwjs.unauthorized(err.message));
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(new throwjs.notFound());
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.statusCode || 500);

    if (isApiRequest(req.originalUrl)) {
      res.json({
        status: err.statusCode,
        name: err.name,
        message: err.message
      });
    } else {
      res.render('error', {
        message: err.message,
        error: err
      });
    }
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);

  if (isApiRequest(req.originalUrl)) {
    res.json({
      status: err.statusCode,
      name: err.name,
      message: err.message
    });
  } else {
    res.render('error', {
      message: err.message,
      error: err
    });
  }
});


module.exports = app;
