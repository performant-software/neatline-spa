import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import store from './store';
import App from './views/app';
import './main.css';
import './omeka_assets/style.css';
import './omeka_assets/iconfonts.css';


const target = document.getElementById('root');
render(
	<Provider store={store}>
		<App/>
	</Provider>,
target);
