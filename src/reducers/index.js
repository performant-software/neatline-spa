import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import user from './user/user-reducer';

import exhibitDelete from './exhibit/exhibitDelete-reducer.js';
import exhibitShow from './exhibit/exhibitShow-reducer.js';
import exhibits from './exhibit/exhibit-reducer.js';
import exhibitCache from './exhibit/exhibitCache-reducer.js';

import record from './record/record-reducer.js';

import mapCache from './map/mapCache-reducer.js';
import mapShow from './map/mapShow-reducer.js';

import leaflet from './leaflet/leaflet-reducer.js';

export default combineReducers({
  form,
  leaflet,
  user,
  exhibits,
  exhibitShow,
  exhibitDelete,
  record,
  mapShow,

  mapCache,
  exhibitCache
});
