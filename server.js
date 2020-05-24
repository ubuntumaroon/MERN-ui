/**
 * UI server
 */
require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
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


const port = process.env.UI_SERVER_PORT || 8000;
app.listen(port, () => {
  console.log(`UI started on port ${port}`);
});
