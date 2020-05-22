/**
 * UI server
 */
require('dotenv').config();
const express = require('express');
const {createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(express.static('public'));

// setup proxy to api
const apiProxyTarget = process.env.API_PROXY_TARGET;
const UI_API_ENDPOINT = process.env.UI_API_ENDPOINT || 'http://localhost:3000/graphql';
if (apiProxyTarget) {
  app.use(UI_API_ENDPOINT, createProxyMiddleware({ target: apiProxyTarget }));
}

// send API env to front end
const env = { UI_API_ENDPOINT };
app.get('/env.js', function(req, res) {
  res.send(`window.ENV = ${JSON.stringify(env)}`);
});



const port = process.env.UI_SERVER_PORT || 8000;
app.listen(port, function () {
  console.log(`UI started on port ${port}`);
});