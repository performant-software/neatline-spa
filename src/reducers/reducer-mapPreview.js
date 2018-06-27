import initialState from './initialState-mapPreview';
import * as actionType from '../actions/action-types';

export default function app(state = initialState, action) {

	switch (action.type) {

		case actionType.PREVIEW_FILLCOLOR:
		console.log(action.payload);
			return{
				...state,
				hasUnsavedChanges:true,
				current: {
					...state.current,
					geometryStyle: {
						...state.current.geometryStyle,
						[action.payload.property]: action.payload.color,
					}
				}
			}

		case actionType.EXHIBIT_PATCH_SUCCESS:
			return{
				...state,
				hasUnsavedChanges:false
			}

		// Set the tilelayer object based on an ID (array position)
		case actionType.SET_TILELAYER:
			return {
				...state,
				hasUnsavedChanges:true,
				current: {
					...state.current,
					tileLayer: state.available.baseMaps[action.payload.id]
				}
			};

		// Create a subset of tilelayer objects based on array of IDs
		case actionType.SET_AVAILABLE_TILELAYERS:
			let availableOptions = [];
			action.payload.ids.forEach((thisID, key, map) => {
				availableOptions.push(state.available.baseMaps[thisID]);
			});
			return {
				...state,
				hasUnsavedChanges:true,
				current: {
					...state.current,
					basemapOptions: availableOptions
				}
			};

		default:
			return state;
	}
}
