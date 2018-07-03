import initialState from './initialState-mapPreview';
import * as actionType from '../actions/action-types';

export default function app(state = initialState, action) {

	switch (action.type) {
		case actionType.PREVIEW_INIT:
			return {
				...state,
				isEditingWithPreview: true,
				hasUnsavedChanges: false,
				current: {
					...state.current,
					geometryStyle: {
						...state.current.geometryStyle,
						[action.payload["o:id"]]: {
							...state.current.geometryStyle['default'],

							stroke_color: action.payload['o:stroke_color'],
							stroke_color_selected: action.payload['o:stroke_color_select'],
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

		case actionType.PREVIEW_UPDATE_BULK:
			return {
				...state,
				hasUnsavedChanges: true,
				current: {
					...state.current,
					geometryStyle: {
						...state.current.geometryStyle,
						[action.payload.recordID]: action.payload
					}
				}
			}

		case actionType.PREVIEW_UPDATE:
			let newState = {
				...state,
				current: {
					...state.current,
					geometryStyle: {
						...state.current.geometryStyle,
						[action.payload.recordID]:{
								...state.current.geometryStyle[action.payload.recordID],
								hasUnsavedChanges:true,
								[action.payload.property]:action.payload.value
						}
					}
				}
			};
			return newState;

		case actionType.EXHIBIT_PATCH_SUCCESS:
			return {
				...state,
				hasUnsavedChanges: false
			}

			// Set the tilelayer object based on an ID (array position)
		case actionType.SET_TILELAYER:
			return {
				...state,
				hasUnsavedChanges: true,
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
				hasUnsavedChanges: true,
				current: {
					...state.current,
					basemapOptions: availableOptions
				}
			};

		default:
			return state;
	}
}
