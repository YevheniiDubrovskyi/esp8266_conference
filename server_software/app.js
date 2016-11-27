const fs = require('fs');
const express = require('express');
const logger = require('morgan');
const mongoose = require('./connection');
const routes = require('./routes');

const appLog = fs.createWriteStream(__dirname + '/log/app.log', {flags: 'a'});
const app = express();

app.disable('x-powered-by');
app.set('trust proxy', true);
app.set('views', './views');
app.set('view engine', 'pug');

app.use(logger('tiny', {stream: appLog}));
app.use('/', routes);

// TODO: Rewrite this middleware with
// checking page existing in DB

// app.use((req, res, next) => {
//   let error = new Error('Not Found');
//   error.statusCode = 404;
//   next(error);
// });

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  res.render('error', {
    message: err.message,
    status: err.statusCode || 500
  });
});

module.exports = app;