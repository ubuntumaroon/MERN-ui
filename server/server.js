/**
 * UI server
 */
require('dotenv').config();
const path = require('path');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const render = require('./render.js');

const app = express();

const enableHMR = (process.env.ENABLE_HMR || 'true') === 'true';
if (enableHMR && (process.env.NODE_ENV !== 'production')) {
  console.log('Adding dev middlware, enabling HMR');

  /* eslint-disable import/no-extraneous-dependencies */
  /* eslint-disable global-require */
  const webpack = require('webpack');
  const devMiddleware = require('webpack-dev-middleware');
  const hotMiddleware = require('webpack-hot-middleware');

  const config = require('../webpack.config.js');
  config.entry.app.push('webpack-hot-middleware/client');
  config.plugins = config.plugins || [];
  config.plugins.push(new webpack.HotModuleReplacementPlugin());

  const compiler = webpack(config);
  app.use(devMiddleware(compiler));
  app.use(hotMiddleware(compiler));
}

app.use(express.static('public'));

// setup proxy to api
const API_USE_PROXY = process.env.API_USE_PROXY === 'true';
const API_HOST = process.env.API_HOST || 'http://localhost:3000';
const API_ENDPOINT = process.env.API_ENDPOINT || '/graphql';

let api = API_ENDPOINT;
if (API_USE_PROXY) {
  app.use(API_ENDPOINT, createProxyMiddleware({ target: API_HOST }));
} else {
  api = API_HOST + API_ENDPOINT;
}

// send API env to front end
const env = { UI_API_ENDPOINT: api };
app.get('/env.js', (_req, res) => {
  res.send(`window.ENV = ${JSON.stringify(env)}`);
});

app.get('/about', render);

// all other pages direct to index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

const port = process.env.UI_SERVER_PORT || 8000;
app.listen(port, () => {
  console.log(`UI started on port ${port}`);
});
