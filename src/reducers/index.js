import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import user from './user/user-reducer';

import exhibitDelete from './exhibit/exhibitDelete-reducer.js';
import exhibitShow from './exhibit/exhibitShow-reducer.js';
import exhibitReducer from './exhibit/exhibit-reducer.js';
import exhibitCacheReducer from './exhibit/exhibitCache-reducer.js';

import recordReducer from './record/record-reducer.js';

import mapCacheReducer from './map/mapCache-reducer.js';

import leaflet from './leaflet/leaflet-reducer.js';

export default combineReducers({
  leaflet,
  form: formReducer,
  user,
  exhibits:exhibitReducer,
  exhibitShow,
  exhibitDelete,
  record: recordReducer,
  mapCache: mapCacheReducer,
  exhibitCache: exhibitCacheReducer
});
