import 'core-js';
import 'regenerator-runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Page from '../src/Page.jsx';
import store from '../src/store.js';

store.initialData = window.__INITIAL_DATA__; // eslint-disable-line no-underscore-dangle
store.userData = window.__USER_DATA__; // eslint-disable-line no-underscore-dangle

const element = (
  <Router>
    <Page />
  </Router>
);

// const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate;
const renderMethod = ReactDOM.hydrate;

renderMethod(element, document.getElementById('contents'));

/** HMR */
if (module.hot) {
  module.hot.accept();
}
