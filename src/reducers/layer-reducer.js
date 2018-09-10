import initialState from './layer-initialState';
import * as ACTION_TYPE from '../actions/action-types';

export default function(state = initialState, action) {
	let updated_recordLayers;

	switch (action.type) {

		case ACTION_TYPE.LAYER_ADDED:
			let layerToAdd = action.payload.layer;
			//console.log("Adding geometry layer, we now have:"+(state.layers.length+1));
			return {
				layers:[
					...state.layers,
					layerToAdd
				]
			};

		case ACTION_TYPE.LAYER_REMOVED:
			let layersToRemove = action.payload.layers._layers;
			updated_recordLayers=state.recordLayers;
			Object.keys(layersToRemove).forEach( idx => {
				let item = action.payload.layers._layers[idx];
				let removalIndex = updated_recordLayers.indexOf(item);
				updated_recordLayers = updated_recordLayers.slice(0);
				updated_recordLayers.splice(removalIndex, 1);
			});
			//console.log("Removing geometry layer, we now have:"+updated_recordLayers.length);
			return {
				...state,
				layers: updated_recordLayers
			};

		case ACTION_TYPE.LAYER_CLEAR:
			//console.log("Resetting to empty");
			return initialState;


		default:
			return state;
	}
}
