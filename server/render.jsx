import React from 'react';
import ReactDomServer from 'react-dom/server';

import About from '../src/About.jsx';
import template from './template.js';

function render(req, res) {
  const body = ReactDomServer.renderToString(
    React.createElement(About),
  );
  res.send(template(body));
}

export default render;
