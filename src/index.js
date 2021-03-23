import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './views/app';
import MapShow from './views/map/show';
import { isEmpty } from './utilities';
import './main.css';

// Conditionally load the Semantic UI theme for stand-alone
const Theme = React.lazy(() => import('./components/Theme'));

const target = document.getElementById('root');
if (target) {
  render(
    <Provider store={store}>
      <React.Fragment>
        <React.Suspense fallback={ <React.Fragment></React.Fragment> }>
          { isEmpty(window.baseRoute) && <Theme/> }
        </React.Suspense>
        <App/>
      </React.Fragment>
    </Provider>,
    target);
}

const maps = document.getElementsByName('neatline-public-exhibit');
if (maps && maps.length) {
  maps.forEach((el) => {
    const id = el.getAttribute('data-exhibit-id');
    render(
      <Provider store={store}>
        <MapShow exhibitId={id} />
      </Provider>,
      el);
  });
}
