'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const device = require('express-device');
const logger = require('morgan');
const mongoose = require('mongoose');
const hpp = require('hpp');
const httpStatus = require('http-status');
const mongoURI = require('./config/keys').mongoURI;
const routes = require('./routes/index');
const otherHelper = require('./helper/others.helper');
const cors = require('cors')


const app = express();

// auth(passport);
// Logger middleware
app.use(logger('dev'));
app.use(device.capture());
// Body parser middleware

// create application/json parser
app.use(
  bodyParser.json({
    limit: '50mb',
  }),
);
// create application/x-www-form-urlencoded parser
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: false,
  }),
);

app.use('/public', express.static(path.join(__dirname, 'public')))

// protect against HTTP Parameter Pollution attacks
app.use(hpp());
app.use(cors())

// DB Config
mongoose.Promise = global.Promise;

let defaults = {};

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}, function (err, done) {
  if (err) {
    console.log(`| MongoDB URL : ${mongoURI}`);
    console.log('|--------------------------------------------');
    console.log('| DataBase Connection Failed', err)
  } else {
    console.log(`| MongoDB URL : ${mongoURI}`);
    console.log('| MongoDB Connected');
    console.log('|--------------------------------------------');
  }
})

app.use('/api', routes);


app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use((err, req, res, next) => {
  if (err.status === 404) {
    return otherHelper.sendResponse(res, httpStatus.NOT_FOUND, false, null, err, 'Route Not Found', null);
  } else {
    console.log('\x1b[41m', err);
    // AddErrorToLogs(req, res, next, err);
    return otherHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, null, err, null, null);
  }
});

module.exports = app;


