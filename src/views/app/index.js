import React from 'react';
import { Route } from 'react-router-dom';
import Exhibits from '../exhibits';
import ExhibitShow from '../exhibits/show';
import ExhibitCreate from '../exhibits/create';

const App = () => (
  <main>
    <Route exact path={`${window.baseRoute}/`} component={Exhibits} />
    <Route path={`${window.baseRoute}/add`} component={ExhibitCreate} />
    <Route path={`${window.baseRoute}/show/:slug`} component={ExhibitShow} />
  </main>
);

export default App;
