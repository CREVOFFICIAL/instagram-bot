import React, {lazy} from 'react';
import { Route, Switch, Router} from 'react-router-dom';

const HomePage = lazy(() => import('./pages/HomePage'))

const routes = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/main" component={HomePage} />
    </Switch>
  </Router>
);

export default routes;
