import * as TYPE from '../../types';
import AlertBar from './alertBar.js';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {change} from 'redux-form';
import {preview_init} from '../../actions';
import LeafletSupport from './leafletSupport';
import LeafletEventHandlers from './leafletEventHandlers';
import {
	clearLayers,
	addLayerTo,
	removeLayerFrom}
	from '../../actions';
// Makes availabe to mapStateToProps
import {selectRecord, deselectRecord, previewRecord, unpreviewRecord} from '../../reducers/not_refactored/exhibitShow';

// Leaflet
import {
	Map,
	LayersControl,
	FeatureGroup
} from 'react-leaflet';
import L from 'leaflet';
import {EditControl} from "react-leaflet-draw"

class ExhibitPublicMap extends Component {


	constructor(props) {
		super(props);


		// Drawing tool options (useImperialUnits, showUnits)
		this.drawingOptions = LeafletSupport.drawingOptions(true,false);

		// Modifies the Circle prototype so we can save to geojson
		let circleToGeoJSON = L.Circle.prototype.toGeoJSON;
		L.Circle.include({
		    toGeoJSON: function() {
		        var feature = circleToGeoJSON.call(this);
		        feature.properties = {
		            point_type: 'circle',
		            radius: this.getRadius()
		        };
		        return feature;
		    }
		});

		this.baseLayers=[];
		this.geometry=null;
	}

	componentWillReceiveProps(nextprops){
		// Update live preview object with known values if they're not present
		for(let x=0;x<nextprops.records.length;x++){
			// FIXME: This should be moved out of this component entirely and put in a saga or reducer
			let record =nextprops.records[x];
			if (record['o:is_coverage']) {
				let record_id = record['o:id'];
				if(!(record_id in this.props.mapPreview.current.geometryStyle)){
					this.props.dispatch(preview_init(record));
				}
			}
		}
	}

	// New record button clicked
	newRecordLoaded = (event) =>{
		this.props.dispatch(clearLayers);
	}



	// Manipulate Map AFTER the map object loads, this is fired of a *child* of <Map/> because of load order
	onMapDidLoad(event){

			// Grab map object by ref
			if(typeof this.refs.map !== 'undefined'){
				this.mapOptionsSet=true;
				let mapInstance = this.refs.map.leafletElement;

				switch (this.props.mapPreview.current.type) {

					// Map layer
					case TYPE.BASELAYER_TYPE.MAP: default:
						// Remove any existing image layers
						mapInstance.eachLayer(function(layer){
							if(layer._image){
								mapInstance.removeLayer(layer);
							}
						});
						break;

					// WMS layer
					case TYPE.BASELAYER_TYPE.WMS:
						// Remove any existing image layers
						mapInstance.eachLayer(function(layer){
							if(layer._image){
								mapInstance.removeLayer(layer);
							}
						});
						break;

					// Image layer
					case TYPE.BASELAYER_TYPE.IMAGE:
						console.log("Post map, image layer...");
						let url = this.props.mapPreview.current.image_address;
						let w = event.currentTarget.naturalWidth;
						let h = event.currentTarget.naturalHeight;
						let maxZoom = 4;
						let southWest = mapInstance.unproject([0, h], maxZoom-1);
						let northEast = mapInstance.unproject([w, 0], maxZoom-1);
						let bounds = new L.LatLngBounds(southWest, northEast);

						// Remove existing image layers
						mapInstance.eachLayer(function(layer){
							if(layer._image){
								mapInstance.removeLayer(layer);
							}
						});

						// Add image to map
						L.imageOverlay(url, bounds).addTo(mapInstance);

						// Add attribution
						mapInstance.attributionControl.addAttribution(this.props.mapPreview.current.image_attribution);

						// Tell leaflet that the map is exactly as big as the image
						mapInstance.setMaxBounds(bounds);

						// Set zoom
						mapInstance.setZoom(1);
						mapInstance.setMaxZoom(maxZoom);

						break;
				}

			}
	}

	componentDidUpdate(){

		/*
		setTimeout(() => {
			console.log("Fixing missing editing object...");
			if(typeof this.refs.editableFeaturegroup !== 'undefined'){
				let featureGroup=this.refs.editableFeaturegroup.leafletElement;

				if(Object.keys(featureGroup._layers).length > 0){
					Object.keys(featureGroup._layers).forEach((key) => {
						let layer = featureGroup._layers[key];
						//delete layer.options.editing;
						//

						try {
							layer.editing.enable();
							//layer.editing.disable();
						} catch (e) {
							layer.options.editing={};
							layer.editing.enable();
							//layer.editing.disable();
							console.log("Failed");
						}

					});
				}
			}
		}, 1000);
		*/
	}

	shouldComponentUpdate(){
		return !LeafletEventHandlers.isEditingGeometry();
	}

	// Render Method
	render() {

		// FIXME: These are a bit awkward
		LeafletEventHandlers.props = this.props;
		LeafletSupport.props = this.props;
		LeafletSupport.onMapDidLoad = this.onMapDidLoad.bind(this);

		// Baselayer setup
		this.baseLayers = LeafletSupport.baseLayerSetup(this.props.mapPreview.current.type);

		// Parse out the records
		this.geometry = LeafletSupport.geometrySetup(this.props.records);


			return (
				<div style={{height:'100%'}}>

					<AlertBar isVisible={this.props.mapPreview.hasUnsavedChanges}
							  message="You have unsaved changes"/>

					<Map ref='map'
						 center={[51.505, -0.09]}
						 zoom={13}
						 className={this.props.mapPreview.hasUnsavedChanges?"ps_n3_mapComponent_withWarning":"ps_n3_mapComponent"}
						 onClick={(event) => {
							if (event.originalEvent.target === event.target.getContainer())
								this.props.mapClick();
							}}>


					<LayersControl position='topright'>
						{this.baseLayers}
						{(this.props.editorRecord || this.props.editorNewRecord) &&
							<FeatureGroup ref='editableFeaturegroup'>


								<EditControl position='topleft'
											 onEdited={LeafletEventHandlers.onEdited}
											 onCreated={LeafletEventHandlers.onCreated}
										 	 onDeleted={LeafletEventHandlers.onDeleted}
											 onMounted={LeafletEventHandlers.onMounted}
											 onEditStart={
											 	()=>{
													console.log("Editing started...");
													LeafletEventHandlers.onEditStart();
												}
											 }
											 onEditStop={LeafletEventHandlers.onEditStop}
										 	 onDeleteStart={LeafletEventHandlers.onDeleteStart}
											 onDeleteStop={LeafletEventHandlers.onDeleteStop}
											 draw={this.drawingOptions}/>
									 		{(this.geometry !== null) && this.geometry.editable}

							</FeatureGroup>
						}
					</LayersControl>
					{(this.geometry !== null) && this.geometry.uneditable}
				</Map>
			</div>
		)
	}
}


// maps this.props.*
const mapStateToProps = state => ({
	mapPreview: state.mapPreview,
	exhibit: state.exhibitShow.exhibit,
	records: state.exhibitShow.records,
	selectedRecord: state.exhibitShow.selectedRecord,
	previewedRecord: state.exhibitShow.previewedRecord,
	editorRecord: state.exhibitShow.editorRecord,
	editorNewRecord: state.exhibitShow.editorNewRecord,
	recordLayers: state.recordMapLayers.layers
});

const mapDispatchToProps = dispatch => bindActionCreators({
	recordClick: record => selectRecord(record),
	mapClick: deselectRecord,
	recordMouseEnter: record => previewRecord(record),
	recordMouseLeave: unpreviewRecord,
	change,
	addLayerTo,
	removeLayerFrom,
	dispatch
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ExhibitPublicMap);
