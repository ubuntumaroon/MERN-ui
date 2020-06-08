import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import routes from './routes.js';

export default function Contents() {
  return (
    <Switch>
      <Redirect exact from="/" to="/issues" />
      { // eslint-disable-next-line react/jsx-props-no-spreading
        routes.map((attrs) => <Route {...attrs} key={attrs.path} />)
      }
    </Switch>
  );
}
