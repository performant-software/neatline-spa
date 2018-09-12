//////////////////////////////////////////////////////////////
// Drawing tool event handlers
// http://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html#events
//////////////////////////////////////////////////////////////
import * as TYPE from '../../types';
import L from 'leaflet';
import {updateRecordCache} from '../../actions';
import uuid from 'uuid-random';




const ldeh= {



	getSingleton: (function() { // BEGIN iife
		var singleton;
		return function() {
			if (!singleton) {
				singleton = {

					initialize: (props, enableMapRender, disableMapRender, enableSpinner, forceRender) => {
						console.log("INITIALIZING");
						this.hasBeenInitialized=true;
						this.forceRender=forceRender;
						this.enableMapRender = enableMapRender;
						this.disableMapRender = disableMapRender;
						this.enableSpinner = enableSpinner;
						this.geometryDidChange=false;
						this.debounceSave=false;
						this.featureGroupLayers=null;
						this.props=props;
					},


					setFeatureGroupLayers: (layers) => {
						//if(this.featureGroupLayers==null){
							this.featureGroupLayers=layers;
						//}
					},

					// Layer editing complete
					onEdited: (e) => {
						//if(!this.debounceSave){
							this.geometryDidChange=true;
							var layers = e.layers;
							let editedLayerStack=[];
							layers.eachLayer(function(layer) {
								editedLayerStack.push(layer);
							});
							this.setFeatureGroupLayers(editedLayerStack);
							let geojsonData = L.featureGroup(editedLayerStack).toGeoJSON();
							this.saveChanges(geojsonData);

						//}
					},


					// Layers finally removed
					 onDeleted: (e) => {
						if(!this.debounceSave){
							debugger


							this.geometryDidChange=true;
							var layers = e.layers;
							let layerArray = [];
							layers.eachLayer(function(layer) {
								layerArray.push(layer);
							});
							let geojsonData = L.featureGroup(layerArray).toGeoJSON();
							debugger
							this.saveChanges(geojsonData);
						}
					},

					// Layer created
					 onCreated: (e) => {
						if(this.featureGroupLayers === null){
							this.featureGroupLayers=[];
						}
						this.featureGroupLayers.push(e.layer);
						let geojsonData = L.featureGroup(this.featureGroupLayers).toGeoJSON();
						this.saveChanges(geojsonData);
					},

					// Palette first arrives on screen
					 onMounted: (e) => {
						 if(typeof this.hasBeenInitialized === 'undefined'){
							 return;
							 console.log("I shouldn't be here");
							 //{(this.props.editorRecord || this.props.editorNewRecord) &&

						 }

						this.enableMapRender();
						this.geometryDidChange=false;
						this.featureGroupLayers=null;

					},

					onDrawStart: (e) => {
					   this.disableMapRender();
				   },

				   onDrawStop: (e) => {
					  console.log("******* EDIT STOP");
					  this.debounceSave=false;
					  if(!this.geometryDidChange){
						  console.log("No change, unlocking");
						  this.enableMapRender();
						  this.geometryDidChange=false;
					  }
				  },


					// Trashpanda button clicked on drawing palette
					 onDeleteStart: (e) => {
						this.disableMapRender();
					},

					 onDeleteStop: (e) => {
						console.log("******* EDIT STOP");
				 		this.debounceSave=false;
				 		if(!this.geometryDidChange){
				 			console.log("No change, unlocking");
				 			this.enableMapRender();
				 			this.geometryDidChange=false;
				 		}
					},

					// Edit button clicked on drawing palette
					 onEditStart: (e) => {
						console.log("******* EDIT START");
						this.disableMapRender();
					},

					 onEditStop:(e) => {
						 console.log("******* EDIT STOP");
						 this.debounceSave=false;
						 if(!this.geometryDidChange){
							 console.log("No change, unlocking");
							 this.enableMapRender();
							 this.geometryDidChange=false;
						 }
					},

					// This is our general-purpose change handler to synch data with the react side
					 saveChanges: (geojsonData) => {
						if (geojsonData) {


							this.enableSpinner();
							this.debounceSave=true;
							let recordId = this.props.editorRecord?this.props.editorRecord['o:id']:TYPE.NEW_UNSAVED_RECORD;

							console.log("LDEH: Saving changes on: " + recordId);
							if(recordId < 0){
								debugger
							}

							// Update hidden fields of redux form
							this.props.change('record', 'o:coverage', geojsonData);
							this.props.change('record', 'o:is_coverage', true);

							// Cache
							this.props.dispatch(updateRecordCache({
								setValues: {
									'o:id': recordId,
									'o:coverage': geojsonData,
									'o:is_coverage': true
								}
							}));

							// Write geometry changes to the database
							var event = new CustomEvent("saveAll");
							document.dispatchEvent(event);
							this.forceRender();

						}
					}




				}
			}
			return singleton;
		};
	}()) // END iife
};
export default ldeh;
