import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {change} from 'redux-form';
import {preview_init} from '../../actions';
import * as types from '../types';
import AlertBar from './alertBar.js';

// Makes availabe to mapStateToProps
import {selectRecord, deselectRecord, previewRecord, unpreviewRecord} from '../../reducers/not_refactored/exhibitShow';
import {addLayer, resetLayers} from '../../reducers/not_refactored/recordMapLayers';

// Leaflet
import {
	Map,
	LayersControl,
	TileLayer,
	WMSTileLayer,
	GeoJSON,
	FeatureGroup,
	ImageOverlay,
	Marker
} from 'react-leaflet';
import L from 'leaflet';
import {circleMarker} from 'leaflet';
import {EditControl} from "react-leaflet-draw"
import {strings} from '../../i18nLibrary';

// FIXME: workaround broken icons when using webpack, see https://github.com/PaulLeCam/react-leaflet/issues/255
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png', iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png'});


class ExhibitPublicMap extends Component {

	constructor(props) {
		super(props);
		this.preview_init=preview_init.bind(this);
	}

	// Event handlers for map editing
	_onEdited = (e) => {
		this._onChange();
	}

	_onCreated = (e) => {
		// Save geometry when it is created - if we don't have a record ID yet, use -1
		const {editorRecord} = this.props;
		const recordId = editorRecord?editorRecord['o:id']: types.TEMPORARY;

		if (recordId){
			this.props.addLayer(recordId, e.layer);
		}
		this._onChange();
	}

	_onMounted = (drawControl) => {
		this._onChange();
	}

	_onChange = () => {
		const {editorRecord, recordLayers} = this.props;
		const recordId = editorRecord
			? editorRecord['o:id']
			: types.TEMPORARY;

		const layersForRecord = recordLayers[recordId];
		if (layersForRecord && layersForRecord.length > 0) {
			const featureGroup = L.featureGroup(layersForRecord)
			const geojsonData = featureGroup.toGeoJSON();
			this.props.change('record', 'o:coverage', geojsonData);
			this.props.change('record', 'o:is_coverage', true);
		}
	}

	componentWillReceiveProps(nextprops){

		// Update live preview object with known values if they're not present
		for(let x=0;x<nextprops.records.length;x++){
			// FIXME: This should be moved out of this component entirely and put in a saga or reducer
			let record =nextprops.records[x];
			if (record['o:is_coverage']) {
				let record_id = record['o:id'];
				if(!(record_id in this.props.mapPreview.current.geometryStyle)){
					this.props.dispatch(this.preview_init(record));
				}
			}
		}

	}



	// Manipulate Map AFTER the map object loads, this is fired of a *child* of <Map/> because of load order
	onMapDidLoad(event){

			// Grab map object by ref
			if(typeof this.refs.map !== 'undefined'){
				this.mapOptionsSet=true;
				let mapInstance = this.refs.map.leafletElement;

				switch (this.props.mapPreview.current.type) {

					// Map layer
					case types.BASELAYER_TYPE.MAP:
						// Remove existing image layers
						mapInstance.eachLayer(function(layer){
							if(layer._image){
								mapInstance.removeLayer(layer);
							}
						});
						break;

					// Map layer
					case types.BASELAYER_TYPE.WMS:
						// Remove existing image layers
						mapInstance.eachLayer(function(layer){
							if(layer._image){
								mapInstance.removeLayer(layer);
							}
						});
						break;

					// Image layer
					case types.BASELAYER_TYPE.IMAGE:

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

						// tell leaflet that the map is exactly as big as the image
						mapInstance.setMaxBounds(bounds);

						// Set zoom
						mapInstance.setZoom(1);
						mapInstance.setMaxZoom(maxZoom);

						L.marker(mapInstance.unproject([0,0], mapInstance.getMaxZoom()-1)).addTo(mapInstance);
						L.marker(mapInstance.unproject([w,h], mapInstance.getMaxZoom()-1)).addTo(mapInstance);
						L.marker(mapInstance.unproject([w,0], mapInstance.getMaxZoom()-1)).addTo(mapInstance);
						L.marker(mapInstance.unproject([0,h], mapInstance.getMaxZoom()-1)).addTo(mapInstance);
						break;
				}

				//mapInstance.setMaxBounds([[0,0], [5000,5000]]);
			}
	}


	// Render Method
	render() {
		// Which baselayer type
		let baseLayers = [];

		// Default CRS (per leaflet docs)
		// NOTE: CRS can only be set on <MAP> creation, changing it after the fact won't do anything
		let crs = L.CRS.EPSG3857;
		switch (this.props.mapPreview.current.type) {

			// Map layer
			case types.BASELAYER_TYPE.MAP:
				crs = L.CRS.EPSG3857;
				baseLayers.push(
					<LayersControl.BaseLayer key={this.props.mapPreview.current.tileLayer.slug}
											 name={this.props.mapPreview.current.tileLayer.displayName}
											 checked={true}>
						<TileLayer 	fattribution={this.props.mapPreview.current.tileLayer.attribution}
								   	url={this.props.mapPreview.current.tileLayer.url}
							   		onLoad={(e) => this.onMapDidLoad(e)}/>
					</LayersControl.BaseLayer>
				);
				break;

			// Image layers use a different CRS
			// https://leafletjs.com/examples/crs-simple/crs-simple.html
			case types.BASELAYER_TYPE.IMAGE:

				// This kicks off an image overlay that is not drawn correctly,
				// so we zero the bounds and use it as a hook to an onload handler
				// This is awkward but not wasted - we need to load the image to get
				// the dimensions anyway.
				crs = L.CRS.Simple;
				baseLayers.push(
					<LayersControl.BaseLayer key={types.BASELAYER_TYPE.IMAGE}
											 name={this.props.mapPreview.current.image_address}
											 checked={true}>
						<ImageOverlay bounds={[[0,0], [0,0]]}
								      url={this.props.mapPreview.current.image_address}
								  	  attribution={this.props.mapPreview.current.image_attribution}
								  	  onLoad={(e) => this.onMapDidLoad(e)}/>
					</LayersControl.BaseLayer>
				);
				break;

			// Custom tile (same as map), FIXME: factor into map case?
		 	case types.BASELAYER_TYPE.TILE:
				crs = L.CRS.EPSG3857;
				baseLayers.push(
					<LayersControl.BaseLayer key={types.BASELAYER_TYPE.TILE}
											 name={this.props.mapPreview.current.tile_attribution}
											 checked={true}>
						<TileLayer 	attribution={this.props.mapPreview.current.tile_attribution}
								   	url={this.props.mapPreview.current.tile_address}
							   		onLoad={(e) => this.onMapDidLoad(e)}/>
					</LayersControl.BaseLayer>
				);
				break;

			// WMS
			case types.BASELAYER_TYPE.WMS:
				crs = L.CRS.EPSG3857;
				baseLayers.push(
					<LayersControl.BaseLayer key={types.BASELAYER_TYPE.WMS}
											 name={this.props.mapPreview.current.wms_address}
											 checked={true}>

						 <WMSTileLayer
							   attribution={this.props.mapPreview.current.wms_attribution}
						       url={this.props.mapPreview.current.wms_address}
							   layers={this.props.mapPreview.current.wms_layers}
						       onLoad={(e) => this.onMapDidLoad(e)}/>
					  </LayersControl.BaseLayer>
				);
				break;

			default:
				console.error("Unknown baselayer type: "+this.props.mapPreview.current.type);
				break;
		}

		// Other options
		for (let x = 0; x < this.props.mapPreview.current.basemapOptions.length; x++) {
			let thisTileLayer = this.props.mapPreview.current.basemapOptions[x];

			// Don't allow duplicate
			if ((typeof this.props.mapPreview.current.tileLayer !== 'undefined') && thisTileLayer.slug !== this.props.mapPreview.current.tileLayer.slug) {
				baseLayers.push(
					<LayersControl.BaseLayer key={thisTileLayer.slug} name={thisTileLayer.displayName} checked={false}>
						<TileLayer attribution={thisTileLayer.attribution} url={thisTileLayer.url}/>
					</LayersControl.BaseLayer>
				);
			}
		}

		const { records, recordClick, mapClick, recordMouseEnter, recordMouseLeave} = this.props;
	   	const position = [51.505, -0.09];
		return (
				<div style={{height:'100%'}}>

					{/* Reminder to save the map */}
					<AlertBar isVisible={this.props.mapPreview.hasUnsavedChanges}
							  message="You have unsaved changes"/>

					<Map ref='map'
						 center={position}
						 zoom={13}
						 crs={L.CRS.EPSG3857}
						 className={this.props.mapPreview.hasUnsavedChanges?"ps_n3_mapComponent_withWarning":"ps_n3_mapComponent"}
						 onClick={(event) => {
							if (event.originalEvent.target === event.target.getContainer())
								mapClick();
							}}>


					<LayersControl position='topright'>

						{baseLayers}

						{/* Conditional, featuregroup appears if this.props is true */}
						{(this.props.editorRecord || this.props.editorNewRecord) &&
								<FeatureGroup>
									<EditControl position='topleft'
												 onEdited={this._onEdited}
												 onCreated={this._onCreated}
											 	 onDeleted={this._onDeleted}
												 onMounted={this._onMounted}
												 onEditStart={this._onEditStart}
												 onEditStop={this._onEditStop}
											 	 onDeleteStart={this._onDeleteStart}
												 onDeleteStop={this._onDeleteStop}
												 draw={{
												 	rectangle: false,
													marker: false
												 }}/>
								</FeatureGroup>
						}
					</LayersControl>

						{records.map(record => {
								const isSelected = record === this.props.selectedRecord;
							    //const isPreviewed = record === this.props.previewedRecord;

								if (record['o:is_wms']) {
									return (
									<LayersControl.Overlay name={record['o:title']} checked={true} key={record['o:id'] + '_wms'}>
										<WMSTileLayer url={record['o:wms_address']} layers={record['o:wms_layers']} transparent={true} format='image/png' opacity={0.8}/>
									</LayersControl.Overlay>)

								} else if (record['o:is_coverage']) {

									// Sometimes JSON arrives as string, but component below will barf on that, so we cast it
									let recordToUse=record['o:coverage'];
									if(typeof recordToUse === 'string'){
										recordToUse=JSON.parse(recordToUse);
									}


									// Use preview
									let record_id = record['o:id'];

									let previewStyle = this.props.mapPreview.current.geometryStyle['default'];
									if(record_id in this.props.mapPreview.current.geometryStyle){
										previewStyle = this.props.mapPreview.current.geometryStyle[record_id];
									}

									let coverageStyle = ()=>{
										return({
											...this.props.mapPreview.current.geometryStyle[record['default']],
											stroke:true,
											color: isSelected?previewStyle.strokeColor_selected:previewStyle.strokeColor,
											weight: previewStyle.stroke_weight,
											opacity: isSelected?previewStyle.stroke_opacity_selected:previewStyle.stroke_opacity,
											fill:true,
											fillColor: isSelected?previewStyle.fillColor_selected:previewStyle.fillColor,
											//fill: feature.geometry.type !== 'LineString',
											fillOpacity: isSelected ? previewStyle.fill_opacity_selected : previewStyle.fill_opacity
										});
									};

									return (
										<GeoJSON
											style={
												function(feature, layer) {
													// If the geometry is a line, get rid of fill
													let style=coverageStyle();
													if(feature.geometry.type === 'LineString'){
															style.fillColor='transparent';
													}
													return style;
												}
											}
											onClick={() => recordClick(record)}
											onMouseover={() => recordMouseEnter(record)}
											onMouseout={recordMouseLeave}
											data={recordToUse}
											pointToLayer={function(point, latlng) {return circleMarker(latlng);}}
											onEachFeature={
												function(feature, layer) {
													this.props.addLayer(record['o:id'], layer);
												}.bind(this)} key={record['o:id'] + '_coverage'
											}/>);

								}

								return null;
							})

					}
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
	recordLayers: state.recordMapLayers.recordLayers
});

const mapDispatchToProps = dispatch => bindActionCreators({
	recordClick: record => selectRecord(record),
	mapClick: deselectRecord,
	recordMouseEnter: record => previewRecord(record),
	recordMouseLeave: unpreviewRecord,
	change,
	addLayer,
	resetLayers,
	dispatch
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ExhibitPublicMap);
