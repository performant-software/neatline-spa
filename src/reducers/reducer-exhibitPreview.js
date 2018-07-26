import initialState from './initialState-exhibitPreview';
import * as ACTION_TYPE from '../actions/action-types';

export default function app(state = initialState, action) {
	switch (action.type) {

		// Accepts an object of kvps, replaces existing values
		// Ignores keys that don't start with 'o:'
		case ACTION_TYPE.EXHIBIT_CACHE_UPDATE:

			// Loop over and overwrite any o: values
			let newCache = state.cache;
			let newValues=action.payload.setValues;
			let keys = Object.keys(newValues);
			for (let idx=0; idx < keys.length;idx++) {
				let key = keys[idx];
			    let value = newValues[key];
				if(key.substring(0, 2) === 'o:'){
					newCache[key]=value;
				}
			}
			return{
				...state,
				cache:newCache
			}

		default:
			return state;
	}
}
