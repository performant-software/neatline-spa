import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {change} from 'redux-form';
import {preview_init} from '../../actions';

// Makes availabe to mapStateToProps
import {selectRecord, deselectRecord, previewRecord, unpreviewRecord} from '../../reducers/not_refactored/exhibitShow';
import {addLayer, resetLayers} from '../../reducers/not_refactored/recordMapLayers';

import {
	Map,
	LayersControl,
	TileLayer,
	WMSTileLayer,
	GeoJSON,
	FeatureGroup
} from 'react-leaflet';
import L from 'leaflet';
import {EditControl} from "react-leaflet-draw"
import {circleMarker} from 'leaflet';
import AlertBar from './alertBar.js';
import {strings} from '../../i18nLibrary';
export const TEMPORARY = -1;

// FIXME: workaround broken icons when using webpack, see https://github.com/PaulLeCam/react-leaflet/issues/255
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png', iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png'});



class ExhibitPublicMap extends Component {


	// Event handlers for map editing
	_onEdited = (e) => {
		this._onChange();
	}

	_onCreated = (e) => {
		// Save geometry when it is created - if we don't have a record ID yet, use -1
		const {editorRecord} = this.props;
		const recordId = editorRecord
			? editorRecord['o:id']
			: TEMPORARY;

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
			: TEMPORARY;

		const layersForRecord = recordLayers[recordId];
		if (layersForRecord && layersForRecord.length > 0) {
			const featureGroup = L.featureGroup(layersForRecord)
			const geojsonData = featureGroup.toGeoJSON();
			this.props.change('record', 'o:coverage', geojsonData);
			this.props.change('record', 'o:is_coverage', true);
		}
	}

	// FIXME: This lifecycle method is going to be deprecated, so we should re-write this,
	// but don't stress right now. Premature optimization isn't cool.
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

	constructor(props) {
		super(props);
		this.preview_init=preview_init.bind(this);
	}

	// Render Method
	render() {

		// The primary layer
		let baseLayers = [];
		baseLayers.push(
			<LayersControl.BaseLayer key={this.props.mapPreview.current.tileLayer.slug}
									 name={this.props.mapPreview.current.tileLayer.displayName}
									 checked={true}>
				<TileLayer attribution={this.props.mapPreview.current.tileLayer.attribution}
						   url={this.props.mapPreview.current.tileLayer.url}/>
			</LayersControl.BaseLayer>
		);

		// Other options
		for (let x = 0; x < this.props.mapPreview.current.basemapOptions.length; x++) {
			let thisTileLayer = this.props.mapPreview.current.basemapOptions[x];

			// Don't allow duplicate
			if (thisTileLayer.slug !== this.props.mapPreview.current.tileLayer.slug) {
				baseLayers.push(<LayersControl.BaseLayer key={thisTileLayer.slug} name={thisTileLayer.displayName} checked={false}>
					<TileLayer attribution={thisTileLayer.attribution} url={thisTileLayer.url}/>
				</LayersControl.BaseLayer>);
			}
		}

		const { records, recordClick, mapClick, recordMouseEnter, recordMouseLeave} = this.props;
	   	const position = [51.505, -0.09];



		return (

				<Map center={position}
					 zoom={13}
					 style={{height: '100%'}}
					 onClick={(event) => {
						if (event.originalEvent.target === event.target.getContainer())
							mapClick();
						}}>

				{/* Reminder to save the map */}
				<AlertBar isVisible={this.props.mapPreview.hasUnsavedChanges}
							message={strings.unsaved_changes}/>


				<LayersControl position='topright'>

					{baseLayers}

					{/* Conditional, featuregroup appears if this.props is true */}
					{(this.props.editorRecord || this.props.editorNewRecord) &&
							<FeatureGroup>
								<EditControl position='topleft' onEdited={this._onEdited} onCreated={this._onCreated} onDeleted={this._onDeleted} onMounted={this._onMounted} onEditStart={this._onEditStart} onEditStop={this._onEditStop} onDeleteStart={this._onDeleteStart} onDeleteStop={this._onDeleteStop} draw={{
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
											}.bind(this)
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
