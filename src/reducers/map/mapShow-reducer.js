import initialState from './mapShow-initialState';
import * as ACTION_TYPE from '../../actions/action-types';

export default function(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPE.MAP_FETCH:
      return {
        ...state,
        loading: true
      };

    case ACTION_TYPE.MAP_FETCH_SUCCESS:
      return {
        ...state,
        exhibit: action.payload,
        loading: false
      };

    case ACTION_TYPE.MAP_FETCH_ERROR:
      return {
        ...state,
        loading: false
      };

    case ACTION_TYPE.MAP_RECORDS_FETCH:
      return {
        ...state,
        loading: true
      };

    case ACTION_TYPE.MAP_RECORDS_FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        records: action.payload
      };

    case ACTION_TYPE.MAP_RECORDS_FETCH_ERROR:
      return {
        ...state,
        loading: false
      };

    case ACTION_TYPE.RECORD_SELECTED:
      return {
        ...state,
        record: action.payload.record
      };

    case ACTION_TYPE.RECORD_DESELECTED:
      return {
        ...state,
        record: null
      };

    default:
      return state;
  }
};
