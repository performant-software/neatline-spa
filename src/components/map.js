import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { selectRecord, deselectRecord, previewRecord, unpreviewRecord } from '../modules/exhibitShow';
import { Map, LayersControl, TileLayer, WMSTileLayer, GeoJSON, FeatureGroup } from 'react-leaflet';
import L from 'leaflet';
import { EditControl } from "react-leaflet-draw"
import { circleMarker } from 'leaflet';

// FIXME: work around broken icons when using webpack, see https://github.com/PaulLeCam/react-leaflet/issues/255
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png',
});


class ExhibitPublicMap extends Component {

	//////////////////////////////////////////////////
	// Event handlers for map editing
	//////////////////////////////////////////////////
	_onEdited = (e) => {

		let numEdited = 0;
		e.layers.eachLayer((layer) => {
			numEdited += 1;
		})
		console.log(`_onEdited: edited ${numEdited} layers`, e);

		this._onChange();
	}

		_onCreated = (e) =>{
		let type = e.layerType;
		let layer = e.layer;
		if (type === 'marker') {
			// Do marker specific actions
			console.log("_onCreated: marker created", e);
		} else {
			console.log("_onCreated: something else created:", type, e);
		}
		// Do whatever else you need to. (save to db; etc)

		this._onChange();
	}

	_onDeleted = (e) => {

		let numDeleted = 0;
		e.layers.eachLayer((layer) => {
			numDeleted += 1;
		})
		console.log(`onDeleted: removed ${numDeleted} layers`, e);

		this._onChange();
	}

	_onMounted = (drawControl) => {
		console.log('_onMounted', drawControl);
	}

	_onEditStart = (e) => {
		console.log('_onEditStart', e);
	}

	_onEditStop = (e) => {
		console.log('_onEditStop', e);
	}

	_onDeleteStart = (e) => {
		console.log('_onDeleteStart', e);
	}

	_onDeleteStop = (e) => {
		console.log('_onDeleteStop', e);
	}

	// I have no idea why this comes here
	_editableFG = null

  _onFeatureGroupReady = (reactFGref) => {

	// populate the leaflet FeatureGroup with the geoJson layers

	let leafletGeoJSON = new L.GeoJSON();
	let leafletFG = reactFGref.leafletElement;

	leafletGeoJSON.eachLayer( (layer) => {
	  leafletFG.addLayer(layer);
	});

	// store the ref for future access to content

	this._editableFG = reactFGref;
  }

	_onChange = () => {

	// this._editableFG contains the edited geometry, which can be manipulated through the leaflet API

	const { onChange } = this.props;

	if (!this._editableFG || !onChange) {
	  return;
	}

	const geojsonData = this._editableFG.leafletElement.toGeoJSON();
	onChange(geojsonData);
  }

	//////////////////////////////////////////////////
	// Render Method
	//////////////////////////////////////////////////
	render() {

	    const { records, recordClick, mapClick, recordMouseEnter, recordMouseLeave, selectedRecord, previewedRecord } = this.props;
	    const position = [51.505, -0.09];

	    return (
	      <Map center={position} zoom={13} style={{ height: '100%' }} onClick={(event) => { if (event.originalEvent.target === event.target.getContainer()) mapClick(); }}>
	        <LayersControl position='topright'>
	          <LayersControl.BaseLayer name='OpenStreetMap' checked={true}>
	            <TileLayer
	              attribution='&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
	              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
	            />
	          </LayersControl.BaseLayer>
			  <FeatureGroup>
	            <EditControl
	              position='topleft'
	              onEdited={this._onEdited}
	              onCreated={this._onCreated}
	              onDeleted={this._onDeleted}
	              onMounted={this._onMounted}
	              onEditStart={this._onEditStart}
	              onEditStop={this._onEditStop}
	              onDeleteStart={this._onDeleteStart}
	              onDeleteStop={this._onDeleteStop}
	              draw={{
	                rectangle: false
	              }}
	            />
	        </FeatureGroup>
	          {records.map(record => {
	            const isSelected = record === selectedRecord,
	                  isPreviewed = record === previewedRecord;
	            if (record['o:is_wms']) {
	              return (
	                <LayersControl.Overlay name={record['o:title']} checked={true} key={record['o:id'] + '_wms'}>
	                  <WMSTileLayer url={record['o:wms_address']} layers={record['o:wms_layers']} transparent={true} format='image/png' opacity={0.8} />
	                </LayersControl.Overlay>
	              )
	            }
	            if (record['o:is_coverage']) {
	              return <GeoJSON
	                       style={function(feature) {
	                         return {
	                           stroke: true,
	                           color: '#000000',
	                           weight: 2,
	                           opacity: isSelected ? 1.0 : 0.6,
	                           fill: true,
	                           fillColor: '#00aeff',
	                           fillOpacity: isPreviewed ? 0.9 : isSelected ? 0.6 : 0.3
	                         };
	                       }}
	                       onClick={() => recordClick(record)}
	                       onMouseover={() => recordMouseEnter(record)}
	                       onMouseout={recordMouseLeave} data={record['o:coverage']}
	                       pointToLayer={function(point, latlng) { return circleMarker(latlng); }}
	                       key={record['o:id'] + '_coverage'}
	                     />
	            }
	            return null;
	          })}
	        </LayersControl>
	      </Map>
	    )
  	}


}

const mapStateToProps = state => ({
  exhibit: state.exhibitShow.exhibit,
  records: state.exhibitShow.records,
  selectedRecord: state.exhibitShow.selectedRecord,
  previewedRecord: state.exhibitShow.previewedRecord
});

const mapDispatchToProps = dispatch => bindActionCreators({
  recordClick: record => selectRecord(record),
  mapClick: deselectRecord,
  recordMouseEnter: record => previewRecord(record),
  recordMouseLeave: unpreviewRecord
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExhibitPublicMap);
