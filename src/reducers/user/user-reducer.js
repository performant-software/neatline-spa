import initialState from './user-initialState';
import * as ACTION_TYPE from '../../actions/action-types';

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPE.USER_LOGIN:
      return {  ...state, login: true, loginError: false };

    case ACTION_TYPE.USER_LOGIN_SUCCESS:
      return { ...state, login: false, userSignedIn: true };

    case ACTION_TYPE.USER_LOGIN_ERRORED:
      return { ...state, login: false, loginError: true };

    case ACTION_TYPE.USER_LOGOUT_SUCCESS:
      return { ...state, userSignedIn: false };

    default:
      return state;
  }
}
