import L from 'leaflet';

const leafletSupport = {
	/*
		NOTE: Circles disabled for alpha
		Issue: https://github.com/performant-software/neatline-3/issues/94

		circle: {
			showRadius: showUnits,
			feet: useImperialUnits,
			metric: !useImperialUnits,
			nautic: false
		}
	*/

	// Drawing options
	// Leaflet docs: http://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html
	drawingOptions : (useImperialUnits, showUnits) =>{
		return({
			draw:{
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
				polyline: {
					showLength: showUnits,
					feet: useImperialUnits,
					metric: !useImperialUnits,
					nautic: false
				},
				circle: false
			}
		});
	},

	// Geojson stores lng,lat, Leaflet expects lat,lng
	invertCoordinateOrder : (coordinates) => {

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
	},

	// Unpacks geojson and returns an array of leaflet vector objects
	convertToVector : (geojson, style, onClick) => {
		if (typeof geojson === 'undefined' || geojson === null) {
			console.error("Cannot convert empty geojson");
			return null;
		}

		let convertedGeometry = [];
		if (typeof geojson.features !== 'undefined') {
			geojson.features.forEach((feature, idx) => {

				let options = {...style,dashArray:4};
				let positions = leafletSupport.invertCoordinateOrder(feature.geometry.coordinates);
				let position = positions[0];

				switch (feature.geometry.type) {

					case "Polygon":
						let polygon = L.polygon(positions,options);
						polygon.on('click', onClick);
						polygon.options.editing || (polygon.options.editing = {});
						convertedGeometry.push(polygon);
						break;

					case "Point": case "Circle":
						// FIXME: Check for circles (points with radius), needs backend support
						// options = {...options,radius:10};
						// let circle = L.circle(position,options);
						let marker = L.marker(position,options);
						marker.on('click', onClick);
						convertedGeometry.push(marker);
						break;

					case "LineString":
					case "MultiLineString":
						options = {	...options, fillColor:"transparent"};
						let polyline = L.polyline(positions,options);
						polyline.on('click', onClick);
						polyline.options.editing || (polyline.options.editing = {});
						convertedGeometry.push(polyline);
						break;

					default:
						console.error("I don't know how to handle geometries of type: " + feature.geometry.type);
				}

			});
		}
		return convertedGeometry;
	},

	removeExistingHandlers : (mapInstance) =>{
		mapInstance.off('draw:created');
		mapInstance.off('draw:deleted');
		mapInstance.off('draw:deletestart');
		mapInstance.off('draw:deletestop');
		mapInstance.off('draw:editstart');
		mapInstance.off('draw:editstop');
		mapInstance.off('draw:edited');
		mapInstance.off('draw:drawstart');
		mapInstance.off('draw:drawstop');
	},

	clearGeometry : (mapInstance) =>{
		mapInstance.eachLayer(function(layer){
			if(typeof layer.feature !== 'undefined'){
				mapInstance.removeLayer(layer);
			}
		});
	}

};
export default leafletSupport;
