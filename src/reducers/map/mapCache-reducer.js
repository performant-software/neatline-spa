import initialState from './mapCache-initialState';
import * as ACTION_TYPE from '../../actions/action-types';
import * as TYPE from '../../types';

export default function app(state = initialState, action) {
	let newState;
	switch (action.type) {

		// Accepts an object of kvps, or an array of same
		// - replaces existing values
		// - ignores keys that don't start with 'o:'
		case ACTION_TYPE.RECORD_CACHE_UPDATE:

			if(typeof action.payload === 'undefined'){
				return;
			}

			let records=[];
			if(Array.isArray(action.payload)){
				records=action.payload;
			}else{
				records.push(action.payload.setValues);
			}

			let newCache = state.cache;
			records.forEach(record =>{

				let recordID = record["o:id"];
				if(typeof  recordID === 'undefined'){
					 recordID = TYPE.NEW_UNSAVED_RECORD;
				}

				if(typeof newCache[recordID] === 'undefined'){
					newCache[recordID] = {};
				}

				// Loop over and overwrite any o: values
				let newValues=record;
				let keys = Object.keys(newValues);
				for (let idx=0; idx < keys.length;idx++) {
					let key = keys[idx];
					let value = newValues[key];
					if(key.substring(0, 2) === 'o:' || key.substring(0, 1) === '@'){
						newCache[recordID][key]=value;
					}
				}
			});

			return{
				...state,
				cache:newCache
			}

		case ACTION_TYPE.RECORD_CACHE_REMOVE_BY_ID:
			newCache = state.cache;
			delete newCache[action.payload];
			return{
				...state,
				cache:newCache
			}

		case ACTION_TYPE.RECORD_CACHE_CLEAR_UNSAVED:
			newCache = state.cache;
			delete newCache[-1];
			return{
				...state,
				cache:newCache
			}

		case ACTION_TYPE.RECORD_CACHE_REMOVE_RECORD:
			newCache = state.cache;
			delete newCache[action.payload.recordID];
			return{
				...state,
				cache:newCache
			}

		case ACTION_TYPE.RECORD_CACHE_CLEAR:
			return{
				...state,
				cache:[]
			}




		case ACTION_TYPE.HAS_UNSAVED_CHANGES:
			newState = {
				...state,
				hasUnsavedChanges:action.payload.hasUnsavedChanges
			};
			return newState;



		case ACTION_TYPE.EXHIBIT_PATCH_SUCCESS:
			return {
				...state,
				hasUnsavedChanges: false
			}


		// Set the tilelayer object based on an ID (array position)
			case ACTION_TYPE.PREVIEW_BASELAYER:
				return {
					...state,
					current: {
						...state.current,
						...action.payload,
						tileLayer: state.available.baseMaps[action.payload.id]
					}
				};

		// Create a subset of tilelayer objects based on array of IDs
		case ACTION_TYPE.SET_AVAILABLE_TILELAYERS:
			let availableOptions = [];
			action.payload.ids.forEach((thisID, key, map) => {
				availableOptions.push(state.available.baseMaps[thisID]);
			});
			return {
				...state,
				current: {
					...state.current,
					basemapOptions: availableOptions
				}
			};

		default:
			return state;
	}
}
