import React from 'react';
import ReactDomServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import Page from '../src/Page.jsx';
import template from './template.js';
import About from '../src/About.jsx';
import store from '../src/store.js';

async function render(req, res) {
  const initialData = await About.fetchData();
  store.initialData = initialData;
  const element = (
    <StaticRouter location={req.url} context={{}}>
      <Page />
    </StaticRouter>
  );
  const body = ReactDomServer.renderToString(element);
  res.send(template(body, initialData));
}

export default render;
