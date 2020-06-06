import 'core-js';
import 'regenerator-runtime';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Page from '../src/Page.jsx';

const element = (
  <Router>
    <Page />
  </Router>
);

const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate;
renderMethod(element, document.getElementById('contents'));

/** HMR */
if (module.hot) {
  module.hot.accept();
}
