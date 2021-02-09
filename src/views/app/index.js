import React from 'react';
import Exhibits from '../exhibits';
import ExhibitShow from '../exhibits/show';
import ExhibitCreate from '../exhibits/create';
import { Router, Route, Switch } from 'react-router-dom';
import AuthenticatedRoute from '../../components/AuthenticatedRoute';
import Login from '../login';
import history from '../../history';

const App = () => (
	<main className="neatline">
    <Router history={history}>
      <Switch>
        <AuthenticatedRoute exact path={`${window.baseRoute}/`} component={Exhibits}/>
        <AuthenticatedRoute path={`${window.baseRoute}/add`} component={ExhibitCreate}/>
        <AuthenticatedRoute path={`${window.baseRoute}/show/:slug`} component={ExhibitShow}/>
        <Route path={`${window.baseRoute}/login`} component={Login}/>
      </Switch>
    </Router>
	</main>
);
export default App;
