//////////////////////////////////////////////////////////////
// Drawing tool event handlers
// http://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html#events
//////////////////////////////////////////////////////////////
import * as TYPE from '../../types';
import L from 'leaflet';
import {updateRecordCache,preview_update} from '../../actions';

let f_editingGeometry = false;
const eventHandlers = {

	// Editing complete
	onEdited: (e) => {
		//console.log("_onEdited");
		eventHandlers.onChange();
	},

	// Layer created
	onCreated: (e) => {
		// Save geometry to record when it is created
		// if we don't have a record ID yet, use TYPE.NEW_UNSAVED_RECORD
		let recordId = eventHandlers.props.editorRecord
			? eventHandlers.props.editorRecord['o:id']
			: TYPE.NEW_UNSAVED_RECORD;
		eventHandlers.props.addLayerTo({record: recordId, layer: e.layer});
		eventHandlers.onChange();
	},

	// Palette first arrives on screen
	onMounted: (drawControl) => {
		eventHandlers.onChange();
	},

	// Layers finally removed
	onDeleted: (e) => {
		let recordId = eventHandlers.props.editorRecord
			? eventHandlers.props.editorRecord['o:id']
			: TYPE.NEW_UNSAVED_RECORD;
		eventHandlers.props.removeLayerFrom({record: recordId, layers: e.layers});
		eventHandlers.onChange();
	},

	// Trashpanda button clicked on drawing palette
	onDeleteStart: (e) => {
		//console.log("_onDeleteStart")
	},
	onDeleteStop: (e) => {
		//console.log("_onDeleteStop")
	},

	// Edit button clicked on drawing palette
	onEditStart: (e) => {
		//console.log("_onEditStart");
		f_editingGeometry=true;
	},

	onEditStop: (e) => {
		//console.log("_onEditStop");
		f_editingGeometry=false;
	},

	isEditingGeometry: () => {
		return f_editingGeometry;
	},

	// This is not a "real" leaflet method, it's our general-purpose change handler to synch data with the react side
	onChange: () => {
		let recordId = eventHandlers.props.editorRecord ? eventHandlers.props.editorRecord['o:id'] : TYPE.NEW_UNSAVED_RECORD;
		if (typeof eventHandlers.props.recordLayers[0] !== 'undefined') {
			let featureGroup = L.featureGroup(eventHandlers.props.recordLayers)
			let geojsonData = featureGroup.toGeoJSON();

			// FIXME: Should really not have both preview and cache. Probably just cache.
			// This also duplicates the functionality of the layer-reducer somewhat, should normalize all of this
			// ISSUE FOR THIS: https://github.com/performant-software/neatline-3/issues/92
			eventHandlers.props.change('record', 'o:coverage', geojsonData);
			eventHandlers.props.change('record', 'o:is_coverage', true);
			eventHandlers.props.dispatch(preview_update({recordID: recordId, property: 'o:coverage', value: geojsonData}));
			eventHandlers.props.dispatch(updateRecordCache({
				setValues: {
					'o:id': recordId,
					'o:coverage': geojsonData
				}
			}));
			eventHandlers.props.dispatch(preview_update({recordID: recordId, property: 'o:is_coverage', value: true}));
			eventHandlers.props.dispatch(updateRecordCache({
				setValues: {
					'o:id': recordId,
					'o:is_coverage': true
				}
			}));
		}
	}

};
export default eventHandlers;
