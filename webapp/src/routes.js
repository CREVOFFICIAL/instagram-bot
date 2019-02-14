import React, {lazy, Suspense} from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';

const HomePage = lazy(() => import('./pages/HomePage'));
const MainPage = lazy(() => import('./pages/MainPage'));

const WaitingComponent = (Component) => (props) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Component {...props} />
  </Suspense>
)

const Routes = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={WaitingComponent(HomePage)} />
      <Route exact path="/main" component={WaitingComponent(MainPage)} />
    </Switch>
  </Router>
);

export default Routes;
