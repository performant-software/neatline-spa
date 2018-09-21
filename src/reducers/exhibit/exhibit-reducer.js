import initialState from './exhibit-initialState';
import * as ACTION_TYPE from '../../actions/action-types';
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
   	   exhibits:action.payload
   	 };

	 case ACTION_TYPE.EXHIBIT_UPDATED:
       return {
         ...state,
         loading: true,
         changedExhibit: action.exhibit
       };

     case ACTION_TYPE.EXHIBIT_PATCH_SUCCESS:
       return {
         ...state,
         loading: false,
         changedExhibit: initialState.changedExhibit
       };

     case ACTION_TYPE.EXHIBIT_PATCH_ERRORED:
       return {
         ...state,
         errored: true
       };

    default:
   	 	return state;
    }
}
