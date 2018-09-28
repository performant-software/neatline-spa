/*
	READ THIS!:

	Hi... This is a a strange component...

	Leaflet and React don't play that nicely together, so what we do is create
	a situation where React renders an empty div, which we then pick up after
	the DOM render which is where leaflet does its thing.

	- Note the empty <div/> in render()
	- All of the work is in this.updateMap();
	- Methods that begin with 'ls_' are specific to leaflet and drawing
	- We toggle rendering off while editing using shouldComponentUpdate()

	For more on the basics of this technique:
	https://reactjs.org/docs/integrating-with-other-libraries.html
*/
import * as TYPE from '../../types';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {change} from 'redux-form';
import {updateRecordCacheAndSave, leafletIsSaving, leafletIsEditing} from '../../actions';
import {selectRecord, deselectRecord, previewRecord, unpreviewRecord} from '../../actions';
import L from 'leaflet';
import Draw from 'leaflet-draw';
import leafletSupport from './leafletSupport.js';

class ExhibitPublicMap extends Component {

	constructor(props) {
		super(props);

		// FIXME: Move these to exhibit settings
		// Issue: https://github.com/performant-software/neatline-3/issues/110
		this.state ={
			map_center:[51.505, -0.09],
			map_zoom:13
		};

		// Render flags, used because we can't use standard react logic
		this.cacheInitialized=false;
		this.mapInitialized=false;
		this.shouldUpdate=true;
		this.isDrawing=false;
		this.Draw = Draw; /* Suppresses include warning */
		this.geoClick=false;
	}

	// Stub for leaflet to attach to
	render() {
		return (<div id='leafletMap'/>)
	}

	// Controls render
	shouldComponentUpdate(){return this.shouldUpdate;}

	// Post-DOM
	componentDidUpdate = () =>{
		// Initialize map
		if(!this.mapInitialized){
			this.ls_mapInit();
		}

		// Update the map
		if(typeof this.props.records !== 'undefined'){
			this.ls_mapUpdate();
		}

		if(this.props.hasWarning){
			document.getElementById('leafletMap').classList.add('ps_n3_mapComponent_withWarning');
		}else{
			document.getElementById('leafletMap').classList.remove('ps_n3_mapComponent_withWarning');
		}
	}

	// Custom event listeners are stopgaps until this gets refactored to follow redux store
	componentDidMount(){
		document.addEventListener("refreshMap", this.event_refreshMap);
	}

	componentWillUnmount(){
		document.removeEventListener("refreshMap", this.event_refreshMap);
	}

	//////////////////////////////////////
	// Leaflet
	//////////////////////////////////////
	ls_mapInit = () => {

		document.getElementById('leafletMap').classList.add('ps_n3_leafletMap');

		this.map = L.map('leafletMap');
		let baselayerType = this.props.mapCache.current.type;
		let currentMapCache = this.props.mapCache.current;
		let initialBaselayer;
		let baseLayers = {};
		let overlays = {};
		switch (baselayerType) {

			// Known map layer
			case TYPE.BASELAYER_TYPE.MAP:
			case TYPE.BASELAYER_TYPE.TILE:
				baseLayers[currentMapCache.tileLayer.displayName] = L.tileLayer(currentMapCache.tileLayer.url, { attribution: currentMapCache.tileLayer.attribution});
				initialBaselayer=baseLayers[currentMapCache.tileLayer.displayName];
				break;

			// Image layer
			case TYPE.BASELAYER_TYPE.IMAGE:
				this.props.leafletIsSaving(true);
				var img = new Image();
					img.src = currentMapCache.image_address;
					img.onerror = () => {
						alert("Invalid Image URL");
						this.props.leafletIsSaving(false);
					}
					img.onload = () => {
						let w = img.width;
						let h = img.height;
						let maxZoom = 4;
						let southWest = this.map.unproject([0, h], maxZoom-1);
						let northEast = this.map.unproject([w, 0], maxZoom-1);
						let imageBounds = new L.LatLngBounds(southWest, northEast);

						// Remove existing image layers and add new one
						this.map.eachLayer(function(layer){
							if(layer._image){
								this.map.removeLayer(layer);
							}
						});
						L.imageOverlay(	currentMapCache.image_address,
										imageBounds,
										{
											attribution:currentMapCache.image_attribution
										}
									  ).addTo(this.map);

						this.map.attributionControl.addAttribution(currentMapCache.image_attribution);

						// Tell leaflet that the map is exactly as big as the image
						this.map.setMaxBounds(imageBounds);

						// Set zoom
						this.map.setZoom(1);
						this.map.setMaxZoom(maxZoom);

						this.props.leafletIsSaving(false);
					};
				break;

				case TYPE.BASELAYER_TYPE.WMS:
					if(currentMapCache.wms_address !== null){
						baseLayers[currentMapCache.wms_address] = L.tileLayer(currentMapCache.wms_address, {
							attribution: currentMapCache.wms_attribution,
							layers: currentMapCache.wms_layers
						});
						initialBaselayer=baseLayers[currentMapCache.wms_address];
					}
					break;


			default:
				console.error("Unknown baselayer type: "+currentMapCache.type);
				break;
		}

		// Other options
		currentMapCache.basemapOptions.forEach(
			thisTileLayer => {
				// Don't allow duplicate
				if ((typeof currentMapCache.tileLayer !== 'undefined') && thisTileLayer.slug !== currentMapCache.tileLayer.slug) {
					baseLayers[thisTileLayer.displayName] = L.tileLayer(thisTileLayer.url, { attribution: thisTileLayer.attribution});
			}
		});

		if(Object.keys(baseLayers).length > 0){
			L.control.layers(baseLayers, overlays).addTo(this.map);
		}
		if(typeof initialBaselayer !== 'undefined'){
			initialBaselayer.addTo(this.map);
		}

		this.map.on('click',(event)=>{this.onMapClick(event);});
		this.map.setView(this.state.map_center,this.state.map_zoom);

		this.ls_fg = new L.FeatureGroup();
		this.ls_fg.addTo(this.map);
		this.ls_drawControl = new L.Control.Draw({
									...leafletSupport.drawingOptions(),
									edit:{featureGroup:this.ls_fg}
								});



		this.mapInitialized=true;
	}

	ls_mapUpdate = () => {

		let mapInstance = this.map;
		let selectedRecord = this.props.selectedRecord;
		let saveChanges =  this.syncDrawWithReact;
		let geometry = this.ls_geometrySetup();

		/*

		// Remove geometries and controls

		if(this.ls_fg !== null){
			mapInstance.removeLayer(this.ls_fg);
			mapInstance.removeControl(this.ls_drawControl);
		}


		// Add geometry to map




		// Rebuild geometry and controls

		if(this.ls_drawControl){
			mapInstance.removeControl(this.ls_drawControl);
		}*/

		this.ls_fg.eachLayer(layer =>{
			this.ls_fg.removeLayer(layer);
		});
		geometry.editable.forEach(layer =>{
			this.ls_fg.addLayer(layer);
		});

		leafletSupport.clearGeometry(mapInstance);
		mapInstance.removeControl(this.ls_drawControl);
		geometry.uneditable.forEach(
			layer=>{layer.addTo(mapInstance);
		});

		if( (typeof selectedRecord !== 'undefined' && selectedRecord !== null) || this.props.editorNewRecord){
			mapInstance.addControl(this.ls_drawControl);
		}




		//////////////////////////////////////
	    // Event handlers
		//////////////////////////////////////
		leafletSupport.removeExistingHandlers(mapInstance);

		mapInstance.on('draw:created', (e) => {
			this.ls_fg.addLayer(e.layer);
			let geojsonData = this.ls_fg.toGeoJSON();
			saveChanges(selectedRecord,geojsonData);
		});

		mapInstance.on('draw:deleted', (e) => {
			this.ls_hasEditToSave=true;
		});

		mapInstance.on('draw:deletestart', (e) => {
			this.props.leafletIsEditing(true);
			this.ls_hasEditToSave=false;
			this.shouldUpdate=false;
			this.isDrawing=true;
		});

		mapInstance.on('draw:deletestop', (e) => {
			this.props.leafletIsEditing(false);
			this.isDrawing=false;
			if(this.ls_hasEditToSave){
				let geojsonData = this.ls_fg.toGeoJSON();
				if(geojsonData.features.length === 0){
					// FIXME: This is not really the way to store empty geometries, but it deals with the backend
					geojsonData={"type": "MultiLineString", "coordinates": []};
				}
				//this.ls_fg.clearLayers();
				saveChanges(selectedRecord,geojsonData);
			}
			this.shouldUpdate=true;
		});

		mapInstance.on('draw:editstart', (e) =>{
			this.shouldUpdate=false;
			this.props.leafletIsEditing(true);
			this.isDrawing=true;
			this.ls_hasEditToSave=false;
		});

		mapInstance.on('draw:editstop', (e) => {
			this.props.leafletIsEditing(false);
			this.isDrawing=false;
			if(this.ls_hasEditToSave){
				let geojsonData = this.ls_fg.toGeoJSON();
				saveChanges(selectedRecord,geojsonData);
			}
			this.shouldUpdate=true;
		});

		mapInstance.on('draw:edited', (e) =>{
			this.ls_hasEditToSave=true;
		});

		mapInstance.on('draw:drawstart', (e) => {
			this.shouldUpdate=false;
			this.props.leafletIsEditing(true);
			this.isDrawing=true;
		});

		mapInstance.on('draw:drawstop', (e) => {
			this.props.leafletIsEditing(false);
			this.isDrawing=false;
			this.shouldUpdate=true;
		});

	}

	ls_geometrySetup = () => {

		if(typeof this.props.records === 'undefined'){return;}

		let onGeometryClick = this.onGeometryClick;
		let selectedRecord = this.props.selectedRecord;
		let onMouseEnter = this.props.recordMouseEnter;
		let onMouseLeave = this.props.recordMouseLeave;

		let editable_geometry=[];
		let uneditable_geometry=[];
		this.props.mapCache.cache.map(record => {
			let isSelected = ((record !== null && selectedRecord !== null) && (record["o:id"] === selectedRecord["o:id"]));
				if (record['o:is_wms']) {
					/*
					// FIXME: Doesn't belong here anymore
					console.error("I am probably broken");
					uneditable_geometry.push(
						<LayersControl.Overlay name={record['o:title']} checked={true} key={record['o:id'] + '_wms'}>
							<WMSTileLayer url={record['o:wms_address']} layers={record['o:wms_layers']} transparent={true} format='image/png' opacity={0.8}/>
						</LayersControl.Overlay>
					);
					*/
				} else if (record['o:is_coverage']) {

					// Sometimes JSON arrives as string, but component below will barf on that, so we cast it
					let geoJSON=record['o:coverage'];
					if(typeof geoJSON === 'string'){geoJSON=JSON.parse(geoJSON);}

					// Style for this geometry
					let defaultGeometryStyle = this.props.mapCache.default.geometryStyles;
					let record_id = record['o:id'];
					let style = defaultGeometryStyle;
					if(record_id in this.props.mapCache.cache){
						style = this.props.mapCache.cache[record_id];
						if(style['o:fill_color'] === null){
							console.log("**** BROKEN STYLE CACHE - USING DEFAULT");
							style = defaultGeometryStyle;
						}
					}else{
						console.log("**** MISSING STYLE CACHE - USING DEFAULT");
					}

					let coverageStyle =()=>{
						return({
							stroke:true,
							fill:true,
							weight: style["o:stroke_width"],
							color: isSelected ? style["o:stroke_color_select"]:style["o:stroke_color"],
							opacity: isSelected ? style["o:stroke_opacity_select"]:style["o:stroke_opacity"],
							fillColor: isSelected ? style["o:fill_color_select"]:style["o:fill_color"],
							fillOpacity: isSelected ? style["o:fill_opacity_select"]:style["o:fill_opacity"]
						});
					}

					if(isSelected){
						editable_geometry = leafletSupport.convertToVector(geoJSON, coverageStyle(), (event)=>{onGeometryClick(event,record)});
					}else{
						/*
						// Build circles from points with props
						// FIXME: Needs to check for props, not stored currently
						geoJSON.features.forEach(
							(feature,idx) => {
								// Circles stored as feature properties
								if(feature.geometry.type === 'Point'){
									circles.push(<Circle 	key={`circle_${idx}`}
															center={{lat:feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0]}}
															fillColor="red"
															radius={99000.000}/>);
								}else{
									nonCircles.features.push(feature);
								}
							}
						);
						*/

						var geoJSONLayer = L.geoJSON();
						geoJSONLayer.addData(geoJSON);

						geoJSONLayer.on('click',(event)=>{onGeometryClick(event,record)});

						// FIXME: The mouse events are wrong
						geoJSONLayer.on('onmouseover',()=>{onMouseEnter(record)});
						geoJSONLayer.on('onmouseleave',()=>{onMouseLeave(record)});
						geoJSONLayer.setStyle(function(feature, layer) {
							// If the geometry is a line, get rid of fill
							let style=coverageStyle();
							if(	feature.geometry.type === 'LineString' ||
								feature.geometry.type === 'MultiLineString'){
									style.fillColor='transparent';
							}
							return style;
						});
						uneditable_geometry.push(geoJSONLayer);

					}
				}
				return null;
			});

		return({editable:editable_geometry,uneditable:uneditable_geometry})
	}


	//////////////////////////////////////
	// Event handlers
	//////////////////////////////////////
	syncDrawWithReact = (selectedRecord,geojsonData) => {

		if(typeof this.props.records === 'undefined'){
			return;
		}
		let recordId = (typeof selectedRecord !== 'undefined' && selectedRecord !== null && selectedRecord['o:id'])?selectedRecord['o:id']:TYPE.NEW_UNSAVED_RECORD;
		this.props.change('record', 'o:coverage', geojsonData);
		this.props.change('record', 'o:is_coverage', true);
		this.props.deselectRecord();
		this.props.updateRecordCacheAndSave({
			setValues: {
				'o:id': recordId,
				'o:coverage': geojsonData,
				'o:is_coverage': true
			},
			selectedRecord:selectedRecord
		});

	}

	event_refreshMap = () => {
		this.cacheInitialized=false;
		this.ls_mapUpdate();
		this.forceUpdate();
		this.props.leafletIsEditing(false);
		this.shouldUpdate=true;
	}

	onGeometryClick=(event,record)=>{
		if(typeof this.props.records === 'undefined' || this.isDrawing){return;}
		L.DomEvent.stop(event);
		this.props.selectRecord({record:record});
		this.forceUpdate();
	}

	onMapClick=()=>{
		if(typeof this.props.records === 'undefined' || this.isDrawing){return;}
		this.map.removeControl(this.ls_drawControl);
		this.props.deselectRecord();
		this.forceUpdate();
	}
}

const mapDispatchToProps = dispatch => bindActionCreators({
	selectRecord,
	leafletIsEditing,
	deselectRecord,
	recordMouseEnter: record => previewRecord(record),
	recordMouseLeave: unpreviewRecord,
	change,
	dispatch,
	leafletIsSaving,
	updateRecordCacheAndSave
}, dispatch);

export default connect(null,mapDispatchToProps)(ExhibitPublicMap);
