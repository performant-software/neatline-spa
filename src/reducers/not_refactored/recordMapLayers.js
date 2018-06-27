export const LAYER_ADDED = 'recordMapLayers/LAYER_ADDED';
export const LAYER_UPDATED = 'recordMapLayers/LAYER_UPDATED';
export const LAYER_REMOVED = 'recordMapLayers/LAYER_REMOVED';
export const LAYERS_RESET = 'recordMapLayers/LAYERS_RESET';

const initialState = {
	recordLayers: {}
}

export default function(state = initialState, action) {
	let updatedRecordLayers = {};
	let updatedLayersForRecord = [];

	switch (action.type) {
		case LAYER_ADDED:
			const layersForRecord = state.recordLayers[action.recordId] || [];
			updatedLayersForRecord = layersForRecord.concat(action.layer);
			updatedRecordLayers = Object.assign({}, state.recordLayers);
			updatedRecordLayers[action.recordId] = updatedLayersForRecord;
			return {
				...state,
				recordLayers: updatedRecordLayers
			};

		case LAYER_UPDATED:
			const updateIndex = state.recordLayers[action.recordId].indexOf(action.layer);
			updatedLayersForRecord = state.recordLayers[action.recordId].slice(0);
			updatedLayersForRecord[updateIndex] = action.layer;
			updatedRecordLayers = Object.assign({}, state.recordLayers);
			updatedRecordLayers[action.recordId] = updatedLayersForRecord;
			return {
				...state,
				recordLayers: updatedRecordLayers
			};

		case LAYER_REMOVED:
			const removalIndex = state.recordLayers[action.recordId].indexOf(action.layer);
			updatedLayersForRecord = state.recordLayers[action.recordId].slice(0);
			updatedLayersForRecord.splice(removalIndex, 1);
			updatedRecordLayers = Object.assign({}, state.recordLayers);
			updatedRecordLayers[action.recordId] = updatedLayersForRecord;
			return {
				...state,
				recordLayers: updatedRecordLayers
			};

		case LAYERS_RESET:
			updatedRecordLayers = {};
			updatedRecordLayers[action.recordId] = [];
			updatedRecordLayers = Object.assign(updatedRecordLayers, state.recordLayers);
			return {
				...state,
				recordLayers: updatedRecordLayers
			}

		default:
			return state;
	}
}

export function addLayer(recordId, layer) {
	return function(dispatch) {
		dispatch({type: LAYER_ADDED, recordId, layer});
	}
}

export function resetLayers(recordId) {
	return function(dispatch) {
		dispatch({type: LAYERS_RESET, recordId});
	}
}
