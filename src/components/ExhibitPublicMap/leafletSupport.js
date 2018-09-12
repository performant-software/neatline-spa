import * as TYPE from '../../types';
import React from 'react';
import {Polyline, Marker, Circle, Polygon} from 'react-leaflet';
import {
	LayersControl,
	TileLayer,
	WMSTileLayer,
	GeoJSON,
	ImageOverlay
} from 'react-leaflet';
import uuid from 'uuid-random';
import L from 'leaflet';
import Draw from 'leaflet-draw'; // eslint-disable-line
const leafletSupport = {

	// Drawing options
	// Leaflet docs: http://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html
	drawingOptions: (useImperialUnits, showUnits) =>{
			return(
				{
					circlemarker: false,
					marker: {},
					rectangle: {
						showArea: showUnits,
						showRadius: showUnits,
						feet: useImperialUnits,
						metric: !useImperialUnits,
						nautic: false
					},
					polygon: {
						showArea: showUnits,
						showLength: showUnits,
						showRadius: showUnits,
						feet: useImperialUnits,
						metric: !useImperialUnits,
						nautic: false
					},
					circle: {
						showRadius: showUnits,
						feet: useImperialUnits,
						metric: !useImperialUnits,
						nautic: false
					},
					polyline: {
						showLength: showUnits,
						feet: useImperialUnits,
						metric: !useImperialUnits,
						nautic: false
					}
				}
			);
	},

	// Unpacks geojson and returns an array of leaflet vector objects
	convertToVector: (geojson, style) => {
		if (typeof geojson === 'undefined' || geojson === null) {
			console.error("Cannot convert empty geojson");
			return null;
		}

		let convertedGeometry = [];
		if (typeof geojson.features !== 'undefined') {
			geojson.features.forEach((currentFeature, idx) => {

				let positions = invertCoordinateOrder(currentFeature.geometry.coordinates);
				let key_id = uuid();
				switch (currentFeature.geometry.type) {

					case "Polygon":
						let options = style;
						let polygon = L.polygon(positions,options);
						convertedGeometry.push(polygon);

						/*
						leafletGeometry.push(<Polygon	key={`polygon_${key_id}`}
														positions={positions}
														stroke={style.stroke}
														color={style.color}
														weight={style.weight}
														opacity={parseFloat(style.opacity)}
														fill={style.fill}
														fillColor={style.fillColor}
														fillOpacity={style.fillOpacity}
														dashArray="4"/>);*/
						break;

					case "Circle":
						//leafletGeometry.push(<Circle key={`circle_${key_id}`} positions={positions} radius="90000" color="purple"/>);
						break;

					case "Point":
						// FIXME: Check for circles (points with radius)
						let position = positions[0];
						/*leafletGeometry.push(<Marker 	key={`marker_${key_id}`}
														position={position}
														stroke={style.stroke}
														color={style.color}
														weight={style.weight}
														opacity={parseFloat(style.opacity)}
														fill={style.fill}
														fillColor={style.fillColor}
														fillOpacity={style.fillOpacity}
														dashArray="4"/>);*/
						break;

					case "LineString":
					case "MultiLineString":
						/*leafletGeometry.push(<Polyline 	key={`polyline_${key_id}`}
														positions={positions}
														stroke={style.stroke}
														color={style.color}
														weight={style.weight}
														opacity={parseFloat(style.opacity)}
														fill={style.fill}
														fillColor='transparent'
														fillOpacity={style.fillOpacity}
														dashArray="4"/>);*/
						break;

					default:
						console.error("I don't know how to handle geometries of type: " + currentFeature.geometry.type);
				}

			});
		}
		return convertedGeometry;
	},

	// Setup the correct baselayer
	mapInit: (currentMapCache,mapInstance,selectedRecord) => {
		let baseLayers=[];
		let baselayerType = currentMapCache.type;
		switch (baselayerType) {

			// Known map layer
			case TYPE.BASELAYER_TYPE.MAP:
				if(typeof currentMapCache.tileLayer !== 'undefined'){
					baseLayers.push(
						<LayersControl.BaseLayer key={TYPE.BASELAYER_TYPE.MAP}
												 name={currentMapCache.tileLayer.displayName}
												 checked={true}>
							<TileLayer 	attribution={currentMapCache.tileLayer.attribution}
										url={currentMapCache.tileLayer.url}
										onLoad={(e) => leafletSupport.onMapDidLoad(e,currentMapCache,mapInstance,selectedRecord)}/>
						</LayersControl.BaseLayer>
					);
				}
				break;


			// Custom tile layer
			case TYPE.BASELAYER_TYPE.TILE:
				if(currentMapCache.tile_address !== null){
					baseLayers.push(
						<LayersControl.BaseLayer key={TYPE.BASELAYER_TYPE.TILE}
												 name={currentMapCache.tile_attribution}
												 checked={true}>
							<TileLayer 	attribution={currentMapCache.tile_attribution}
										url={currentMapCache.tile_address}
										onLoad={(e) => leafletSupport.onMapDidLoad(e,currentMapCache,mapInstance,selectedRecord)}/>
						</LayersControl.BaseLayer>
					);
				}
				break;

			// Image layer
			case TYPE.BASELAYER_TYPE.IMAGE:
				// This kicks off an image overlay that is not drawn correctly,
				// so we zero the bounds and use it as a hook to an onload handler
				// This is awkward but not wasted - we need to load the image to get
				// the dimensions anyway.
				baseLayers.push(
					<LayersControl.BaseLayer key={TYPE.BASELAYER_TYPE.IMAGE}
											 name={currentMapCache.image_address}
											 checked={true}>
						<ImageOverlay bounds={[[0,0], [0,0]]}
									  url={currentMapCache.image_address}
									  attribution={currentMapCache.image_attribution}
									  onLoad={(e) => leafletSupport.onMapDidLoad(e,currentMapCache,mapInstance,selectedRecord)}/>
					</LayersControl.BaseLayer>
				);
				break;

			// WMS
			case TYPE.BASELAYER_TYPE.WMS:
				if(currentMapCache.wms_address !== null){
					baseLayers.push(
						<LayersControl.BaseLayer key={TYPE.BASELAYER_TYPE.WMS}
												 name={currentMapCache.wms_address}
												 checked={true}>

							 <WMSTileLayer
								   attribution={currentMapCache.wms_attribution}
								   url={currentMapCache.wms_address}
								   layers={currentMapCache.wms_layers}
								   onLoad={(e) => this.onMapDidLoad(e,currentMapCache,mapInstance,selectedRecord)}/>
						  </LayersControl.BaseLayer>
					);
				}
				break;

			default:
				console.error("Unknown baselayer type: "+currentMapCache.type);
				break;
		}

		// Other options
		for (let x = 0; x < currentMapCache.basemapOptions.length; x++) {
			let thisTileLayer = currentMapCache.basemapOptions[x];

			// Don't allow duplicate
			if ((typeof currentMapCache.tileLayer !== 'undefined') && thisTileLayer.slug !== currentMapCache.tileLayer.slug) {
				baseLayers.push(
					<LayersControl.BaseLayer key={thisTileLayer.slug} name={thisTileLayer.displayName} checked={false}>
						<TileLayer attribution={thisTileLayer.attribution} url={thisTileLayer.url}/>
					</LayersControl.BaseLayer>
				);
			}
		}

		return baseLayers;
	},

	//this.props.mapCache.current
	//leafletSupport.props.selectedRecord
	_geometrySetup: (records, onGeometryClick, mapCache, selectedRecord, onMouseEnter, onMouseLeave) => {
		let editable_geometry=[];
		let uneditable_geometry=[];
		records.map(record => {
			let isSelected = (record === selectedRecord);

				if (record['o:is_wms']) {
					// FIXME: Doesn't belong here anymore
					console.error("I am probably broken");
					uneditable_geometry.push(
						<LayersControl.Overlay name={record['o:title']} checked={true} key={record['o:id'] + '_wms'}>
							<WMSTileLayer url={record['o:wms_address']} layers={record['o:wms_layers']} transparent={true} format='image/png' opacity={0.8}/>
						</LayersControl.Overlay>
					);

				} else if (record['o:is_coverage']) {

					// Sometimes JSON arrives as string, but component below will barf on that, so we cast it
					let geoJSON=record['o:coverage'];
					if(typeof geoJSON === 'string'){geoJSON=JSON.parse(geoJSON);}


					// Style for this geometry
					let record_id = record['o:id'];
					let geometry_id = `geometry_${record_id}`;
					let style = {
						'o:stroke_width': 2,
						'o:stroke_color': '#FF00FF',
						'o:stroke_color_select': '#FF00FF',
						'o:stroke_opacity': 1.0,
						'o:stroke_opacity_select': 1.0,
						'o:fill_opacity': 0.5,
						'o:fill_color': '#FF00FF',
						'o:fill_color_select': '#FF00FF'

					};
					if(record_id in mapCache){
						style = mapCache[record_id];
					}else{
						console.log("**** MISSING STYLE CACHE - USING DEFAULT");
					}

					let coverageStyle = (record_id)=>{
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
						editable_geometry = leafletSupport.convertToVector(geoJSON, coverageStyle(record_id));
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

						geoJSONLayer.on('click',()=>{onGeometryClick(record)});

						// FIXME: The mouse events are wrong
						geoJSONLayer.on('onmouseover',()=>{onMouseEnter(record)});
						geoJSONLayer.on('onmouseleave',()=>{onMouseLeave(record)});

						geoJSONLayer.setStyle(function(feature, layer) {
							// If the geometry is a line, get rid of fill
							let style=coverageStyle(record_id);
							if(feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString'){
									style.fillColor='transparent';
							}
							return style;
						});
						uneditable_geometry.push(geoJSONLayer);

					}
				}
				return null;
			});


		return(
			{editable:editable_geometry,
			uneditable:uneditable_geometry
			}
		)
	},

	// Manipulate Map AFTER the map object loads, this is fired of a *child* of <Map/> because of load order
	onMapDidLoad: (event,currentMapCache,mapInstance,selectedRecord)=>{

			// Grab map object by ref
			if(typeof mapInstance !== 'undefined'){
				switch (currentMapCache.type) {

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
						let url = currentMapCache.image_address;
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
						mapInstance.attributionControl.addAttribution(currentMapCache.image_attribution);

						// Tell leaflet that the map is exactly as big as the image
						mapInstance.setMaxBounds(bounds);

						// Set zoom
						mapInstance.setZoom(1);
						mapInstance.setMaxZoom(maxZoom);


						break;
				}

			}
	},

	drawingSetup: (mapInstance,selectedRecord,records,onGeometryClick,mapCache,onMouseEnter,onMouseLeave,saveChanges) => {


		let geometry = leafletSupport._geometrySetup(
					records,
					onGeometryClick,
					mapCache,
					selectedRecord,
					onMouseEnter,
					onMouseLeave);

		console.log("Drawing setup and map rebuild:"+selectedRecord);

		mapInstance.eachLayer(function(layer){
			if(typeof layer.feature !== 'undefined' && layer.feature.type === "Feature"){
				mapInstance.removeLayer(layer);
			}
		});

		if(leafletSupport.fg){
			mapInstance.removeLayer(leafletSupport.fg);
			mapInstance.removeControl(leafletSupport.drawControl);
		}
		leafletSupport.fg = new L.FeatureGroup(geometry.editable);
		let options = leafletSupport.drawingOptions();
			options = {
				...options,
				edit:{
					featureGroup:leafletSupport.fg
				}
			}

		leafletSupport.drawControl = new L.Control.Draw(options);
		mapInstance.addControl(leafletSupport.drawControl);
		leafletSupport.fg.addTo(mapInstance);

		 geometry.uneditable.forEach(layer =>{
			 layer.addTo(mapInstance);
		 });


		//////////////////////////////////////
	    // Event handlers



		mapInstance.off('draw:created');
		mapInstance.on('draw:created', function (e) {
			/*
			// Save geometry to record when it is created
			// if we don't have a record ID yet, use TYPE.NEW_UNSAVED_RECORD
			let recordId = eventHandlers.props.editorRecord
				? eventHandlers.props.editorRecord['o:id']
				: TYPE.NEW_UNSAVED_RECORD;
			eventHandlers.props.addLayerTo({record: recordId, layer: e.layer});
			eventHandlers.onChange();
			*/
		});

		/*
		mapInstance.off('draw:deleted');
		mapInstance.on('draw:deleted', function (e) {
			let recordId = eventHandlers.props.editorRecord
				? eventHandlers.props.editorRecord['o:id']
				: TYPE.NEW_UNSAVED_RECORD;
			eventHandlers.props.removeLayerFrom({record: recordId, layers: e.layers});
			eventHandlers.onChange();
		});

		mapInstance.off('draw:deletestart');
		mapInstance.on('draw:deletestart', function (e) {});

		mapInstance.off('draw:deletestop');
		mapInstance.on('draw:deletestop', function (e) {});
		*/

		mapInstance.off('draw:editstart');
		mapInstance.on('draw:editstart', (e) =>{});

		mapInstance.off('draw:editstop');
		mapInstance.on('draw:editstop', (e) => {});

		mapInstance.off('draw:edited');
		mapInstance.on('draw:edited', (e) =>{
			console.log("Editing complete");
			let geojsonData = leafletSupport.fg.toGeoJSON();
			saveChanges(selectedRecord,geojsonData);
		});

	},




};




// Geojson stores lng,lat, Leaflet expects lat,lng
const invertCoordinateOrder = (coordinates) => {

	let latLngSet = [];
	if (Array.isArray(coordinates[0])) {

		let coordinateArray=coordinates[0];
		if (coordinates.length > 2){
			coordinateArray=coordinates;
		}

		coordinateArray.forEach(coordinatePair => {
			latLngSet.push([
				coordinatePair[1], coordinatePair[0]
			]);
		});
		latLngSet = [latLngSet];
	} else {
		latLngSet.push([
			coordinates[1], coordinates[0]
		]);
	}
	return latLngSet;
}

export default leafletSupport;
