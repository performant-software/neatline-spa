import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import user from './not_refactored/user';

import exhibitShow from './not_refactored/exhibitShow';
/*
import exhibits from './not_refactored/exhibits';
import exhibitCreate from './not_refactored/exhibitCreate';
*/
import exhibitDelete from './not_refactored/exhibitDelete';

import recordMapLayers from './not_refactored/recordMapLayers';


import exhibitReducer from './exhibit-reducer.js';
import recordReducer from './record-reducer.js';
import mapPreviewReducer from './mapPreview-reducer.js';
import exhibitPreviewReducer from './exhibitPreview-reducer.js';

export default combineReducers({
  routing: routerReducer,
  form: formReducer,
  user,
  exhibits:exhibitReducer,
  //exhibits,
  exhibitShow,
  //exhibitCreate,
  exhibitDelete,
  record: recordReducer,
  mapPreview: mapPreviewReducer,
  exhibitPreview: exhibitPreviewReducer,
  recordMapLayers:recordMapLayers
});
