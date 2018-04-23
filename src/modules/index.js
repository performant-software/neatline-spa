import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import user from './user';
import exhibits from './exhibits';
import exhibitShow from './exhibitShow';
import exhibitCreate from './exhibitCreate';
import exhibitUpdate from './exhibitUpdate';
import exhibitDelete from './exhibitDelete';
import recordCreate from './recordCreate';
import recordUpdate from './recordUpdate';
import recordDelete from './recordDelete';

export default combineReducers({
  routing: routerReducer,
  form: formReducer,
  user,
  exhibits,
  exhibitShow,
  exhibitCreate,
  exhibitUpdate,
  exhibitDelete,
  recordCreate,
  recordUpdate,
  recordDelete
});
