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

		let leafletGeometry = [];
		if (typeof geojson.features !== 'undefined') {
			geojson.features.forEach((currentFeature, idx) => {

				let positions = invertCoordinateOrder(currentFeature.geometry.coordinates);
				let key_id = uuid();
				switch (currentFeature.geometry.type) {

					case "Polygon":
						leafletGeometry.push(<Polygon	key={`polygon_${key_id}`}
														positions={positions}
														stroke={style.stroke}
														color={style.color}
														weight={style.weight}
														opacity={parseFloat(style.opacity)}
														fill={style.fill}
														fillColor={style.fillColor}
														fillOpacity={style.fillOpacity}
														dashArray="4"/>);
						break;

					case "Circle":
						leafletGeometry.push(<Circle key={`circle_${key_id}`} positions={positions} radius="90000" color="purple"/>);
						break;

					case "Point":
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
						let position = positions[0];
						leafletGeometry.push(<Marker 	key={`marker_${key_id}`}
														position={position}
														stroke={style.stroke}
														color={style.color}
														weight={style.weight}
														opacity={parseFloat(style.opacity)}
														fill={style.fill}
														fillColor={style.fillColor}
														fillOpacity={style.fillOpacity}
														dashArray="4"/>);
						break;

					case "LineString":
						//console.log(positions);
						leafletGeometry.push(<Polyline 	key={`polyline_${key_id}`}
														positions={positions}
														stroke={style.stroke}
														color={style.color}
														weight={style.weight}
														opacity={parseFloat(style.opacity)}
														fill={style.fill}
														fillColor={style.fillColor}
														fillOpacity={style.fillOpacity}
														dashArray="4"/>);
						break;

					default:
						console.error("I don't know how to handle geometries of type: " + currentFeature.geometry.type);
				}

			});
		}
		return leafletGeometry;
	},

	// Setup the correct baselayer
	baseLayerSetup: (baselayerType) => {
		let baseLayers=[];
		switch (baselayerType) {

			// Known map layer
			case TYPE.BASELAYER_TYPE.MAP:
				if(typeof leafletSupport.props.mapPreview.current.tileLayer !== 'undefined'){
					baseLayers.push(
						<LayersControl.BaseLayer key={TYPE.BASELAYER_TYPE.MAP}
												 name={leafletSupport.props.mapPreview.current.tileLayer.displayName}
												 checked={true}>
							<TileLayer 	attribution={leafletSupport.props.mapPreview.current.tileLayer.attribution}
										url={leafletSupport.props.mapPreview.current.tileLayer.url}
										onLoad={(e) => leafletSupport.onMapDidLoad(e)}/>
						</LayersControl.BaseLayer>
					);
				}
				break;


			// Custom tile layer
			case TYPE.BASELAYER_TYPE.TILE:
				if(leafletSupport.props.mapPreview.current.tile_address !== null){
					baseLayers.push(
						<LayersControl.BaseLayer key={TYPE.BASELAYER_TYPE.TILE}
												 name={leafletSupport.props.mapPreview.current.tile_attribution}
												 checked={true}>
							<TileLayer 	attribution={leafletSupport.props.mapPreview.current.tile_attribution}
										url={leafletSupport.props.mapPreview.current.tile_address}
										onLoad={(e) => leafletSupport.onMapDidLoad(e)}/>
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
											 name={leafletSupport.props.mapPreview.current.image_address}
											 checked={true}>
						<ImageOverlay bounds={[[0,0], [0,0]]}
									  url={leafletSupport.props.mapPreview.current.image_address}
									  attribution={leafletSupport.props.mapPreview.current.image_attribution}
									  onLoad={(e) => leafletSupport.onMapDidLoad(e)}/>
					</LayersControl.BaseLayer>
				);
				break;

			// WMS
			case TYPE.BASELAYER_TYPE.WMS:
				if(leafletSupport.props.mapPreview.current.wms_address !== null){
					baseLayers.push(
						<LayersControl.BaseLayer key={TYPE.BASELAYER_TYPE.WMS}
												 name={leafletSupport.props.mapPreview.current.wms_address}
												 checked={true}>

							 <WMSTileLayer
								   attribution={leafletSupport.props.mapPreview.current.wms_attribution}
								   url={leafletSupport.props.mapPreview.current.wms_address}
								   layers={leafletSupport.props.mapPreview.current.wms_layers}
								   onLoad={(e) => leafletSupport.onMapDidLoad(e)}/>
						  </LayersControl.BaseLayer>
					);
				}
				break;

			default:
				console.error("Unknown baselayer type: "+leafletSupport.props.mapPreview.current.type);
				break;
		}

		// Other options
		for (let x = 0; x < leafletSupport.props.mapPreview.current.basemapOptions.length; x++) {
			let thisTileLayer = leafletSupport.props.mapPreview.current.basemapOptions[x];

			// Don't allow duplicate
			if ((typeof leafletSupport.props.mapPreview.current.tileLayer !== 'undefined') && thisTileLayer.slug !== leafletSupport.props.mapPreview.current.tileLayer.slug) {
				baseLayers.push(
					<LayersControl.BaseLayer key={thisTileLayer.slug} name={thisTileLayer.displayName} checked={false}>
						<TileLayer attribution={thisTileLayer.attribution} url={thisTileLayer.url}/>
					</LayersControl.BaseLayer>
				);
			}
		}

		return baseLayers;
	},

	geometrySetup: (records) => {
		let editable_geometry=[];
		let uneditable_geometry=[];
		records.map(record => {
			let isSelected = (record === leafletSupport.props.selectedRecord);

				if (record['o:is_wms']) {
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
					let previewStyle = leafletSupport.props.mapPreview.current.geometryStyle['default'];
					if(record_id in leafletSupport.props.mapPreview.current.geometryStyle){
						previewStyle = leafletSupport.props.mapPreview.current.geometryStyle[record_id];
					}

					let coverageStyle = ()=>{
						return({
							...leafletSupport.props.mapPreview.current.geometryStyle[record['default']],
							stroke:true,
							color: isSelected?previewStyle.strokeColor_selected:previewStyle.strokeColor,
							weight: previewStyle.stroke_weight,
							opacity: isSelected?previewStyle.stroke_opacity_selected:previewStyle.stroke_opacity,
							fill:true,
							fillColor: isSelected?previewStyle.fillColor_selected:previewStyle.fillColor,
							fillOpacity: isSelected ? previewStyle.fill_opacity_selected : previewStyle.fill_opacity
						});
					};

					if(isSelected){
						editable_geometry.push(leafletSupport.convertToVector(geoJSON, coverageStyle()));
					}else{
						uneditable_geometry.push(
							<div key={geometry_id}>
								<GeoJSON
									key={geometry_id}
									ref={geometry_id}
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
									onClick={() => leafletSupport.props.recordClick(record)}
									onMouseover={() => leafletSupport.props.recordMouseEnter(record)}
									onMouseout={leafletSupport.props.recordMouseLeave}
									data={geoJSON}/>
							</div>
						);
					}
				}
				return null;
			});


		return(
			{editable:editable_geometry,
			uneditable:uneditable_geometry
			}
		)
	}
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
