import { combineReducers } from 'redux';

import { reducer as formReducer } from 'redux-form';
import user from './not_refactored/user';

import exhibitShow from './not_refactored/exhibitShow';
import exhibitDelete from './not_refactored/exhibitDelete';
/*
import exhibitCreate from './not_refactored/exhibitCreate';
*/

import layerReducer from './layer-reducer.js';
import exhibitReducer from './exhibit-reducer.js';
import recordReducer from './record-reducer.js';
import mapPreviewReducer from './mapPreview-reducer.js';
import exhibitPreviewReducer from './exhibitPreview-reducer.js';

export default combineReducers({
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
  recordMapLayers:layerReducer
});
