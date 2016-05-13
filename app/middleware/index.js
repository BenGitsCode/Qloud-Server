'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const loader = require('lib/wiring/loader');

const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:8080',
};

const before = (app) => {
  app.use(cors(corsOptions));
  app.use(favicon(path.join(app.get('root'), 'public', 'favicon.ico')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
};

const after = (app) => {
  app.use(express.static(path.join(app.get('root'), 'public')));
};

const middleware = loader(__filename);
middleware.before = before;
middleware.after = after;

module.exports = middleware;
