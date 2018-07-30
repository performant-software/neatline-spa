import initialState from './exhibit-initialState';
import * as ACTION_TYPE from '../actions/action-types';

export default function(state = initialState, action) {
	switch (action.type) {

	 case ACTION_TYPE.EXHIBITS_LOADING:
   	 return {
   	   ...state,
   	   loading: action.loading
   	 };

     case ACTION_TYPE.EXHIBITS_ERRORED:
   	 return {
   	   ...state,
   	   errored: action.errored
   	 };

     case ACTION_TYPE.EXHIBITS_FETCH_SUCCESS:
   	 return {
   	   ...state,
   	   exhibits: action.payload
   	 };

    default:
   	 	return state;
    }
}
