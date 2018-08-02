import initialState from './mapPreview-initialState';
import * as ACTION_TYPE from '../actions/action-types';

export default function app(state = initialState, action) {
	let newState;

	switch (action.type) {

		// Accepts an object of kvps, replaces existing values
		// Ignores keys that don't start with 'o:'
		case ACTION_TYPE.RECORD_CACHE_UPDATE:
			let recordID = action.payload.setValues["o:id"];
			let newCache = state.cache;

			if(typeof newCache[recordID] === 'undefined'){
				newCache[recordID] = {};
			}

			// Loop over and overwrite any o: values
			let newValues=action.payload.setValues;
			let keys = Object.keys(newValues);
			for (let idx=0; idx < keys.length;idx++) {
				let key = keys[idx];
				let value = newValues[key];
				if(key.substring(0, 2) === 'o:' || key.substring(0, 1) === '@'){
					newCache[recordID][key]=value;
				}
			}
			return{
				...state,
				cache:newCache
			}


		case ACTION_TYPE.PREVIEW_MARKSELECTED:
			return {
				...state,
				selectedRecordID:action.payload
			}
		case ACTION_TYPE.PREVIEW_INIT:
			return {
				...state,
				isEditingWithPreview: true,
				current: {
					...state.current,
					geometryStyle: {
						...state.current.geometryStyle,
						[action.payload["o:id"]]: {
							...state.current.geometryStyle['default'],

							strokeColor: action.payload['o:stroke_color'],
							strokeColor_selected: action.payload['o:stroke_color_select'],
							stroke_opacity: action.payload['o:stroke_opacity'],
							stroke_opacity_selected: action.payload['o:stroke_opacity_select'],
							stroke_weight: action.payload['o:stroke_width'],

							fillColor: action.payload['o:fill_color'],
							fillColor_selected: action.payload['o:fill_color_select'],
							fill_opacity: action.payload['o:fill_opacity'],
							fill_opacity_selected: action.payload['o:fill_opacity_select']
						}
					}
				}
			}

		case ACTION_TYPE.PREVIEW_UPDATE_BULK:
			return {
				...state,
				current: {
					...state.current,
					geometryStyle: {
						...state.current.geometryStyle,
						[action.payload.recordID]: action.payload
					}
				}
			}

		case ACTION_TYPE.HAS_UNSAVED_CHANGES:
			newState = {
				...state,
				hasUnsavedChanges:action.payload.hasUnsavedChanges
			};
			return newState;

		case ACTION_TYPE.PREVIEW_UPDATE:
			newState = {
				...state,
				current: {
					...state.current,
					geometryStyle: {
						...state.current.geometryStyle,
						[action.payload.recordID]:{
								...state.current.geometryStyle[action.payload.recordID],
								[action.payload.property]:action.payload.value
						}
					}
				}
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
