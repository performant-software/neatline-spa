import * as TYPE from '../../types';
import AlertBar from '../AlertBar';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {change} from 'redux-form';
import {updateRecordCache, leafletIsEditing, leafletIsSaving} from '../../actions';
import LeafletSupport from './leafletSupport';
import LeafletDrawEventHandler from './leafletDrawEventHandler';
import {selectRecord, deselectRecord, previewRecord, unpreviewRecord} from '../../actions';
import uuid from 'uuid-random';

// Leaflet
import {
	Map,
	LayersControl,
	FeatureGroup
} from 'react-leaflet';
import L from 'leaflet';


class ExhibitPublicMap extends Component {

	constructor(props) {
		super(props);

		// Modifies the Circle prototype so we can save to geojson
		// FIXME: This won't work unless we change the datastore
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

		// Map defaults
		// FIXME: should be moved to exhibit
		this.state ={
			map_center:[51.505, -0.09],
			map_zoom:13
		};
		this.initialDrawSetup=false;
		this.baselayers=null;
		this.currentRecordID=null;
		this.shouldUpdate=false;
		this.cacheInitialized=false;
		this.isSaving=false;
	}

	reRender=()=>{this.forceUpdate();}
	enableMapRender=()=>{this.props.dispatch(leafletIsEditing(false));}
	disableMapRender=()=>{this.props.dispatch(leafletIsEditing(true));}
	enableSpinner=()=>{this.props.dispatch(leafletIsSaving(true));}

	shouldComponentUpdate(){
		return this.shouldUpdate;
	}
	onGeometryClick=(record)=>{
		if(this.isSaving){return;}
		this.props.recordClick(record);
		this.forceUpdate();
	}
	onMapClick=()=>{
			if(this.isSaving){return;}
			this.props.deselectRecord();
			/*
			////console.log("unSet editor record");
			return function(dispatch, getState) {
				dispatch({type: ACTION_TYPE.RECORD_CACHE_CLEAR_UNSAVED});
				dispatch({type: ACTION_TYPE.EDITOR_RECORD_UNSET});
				const exhibit = getState().exhibitShow.exhibit;
				if (exhibit){
					history.push(`${window.baseRoute}/show/${exhibit['o:slug']}`)
				}
			}
			*/
			this.forceUpdate();

	}

	componentDidMount(){
		document.addEventListener("saveComplete", this.saveComplete);
		this.forceUpdate();
	}


	componentWillUnMount(){
		document.removeEventListener("saveComplete", this.saveComplete);
	}

	componentDidUpdate = () =>{
		if(this.isSaving){return;}
		console.log("Update...");

		if(!this.cacheInitialized){
			// Update cache if we need to
			let cacheNeededUpdate=false;
			this.props.records.forEach(
				record =>{
				if (record['o:is_coverage']) {
					cacheNeededUpdate=true;
					this.props.dispatch(updateRecordCache({setValues:record}));
				}
			});
			if(cacheNeededUpdate){
				console.log("Cache established...");
				this.geometry=null;
				this.forceUpdate();
			}
			this.cacheInitialized=true;
		}


		// Baselayer setup
		if(this.baselayers === null){
			if(typeof this.refs.map.leafletElement !== 'undefined'){
				this.baselayers = LeafletSupport.mapInit(this.props.mapCache.current,
														 this.refs.map.leafletElement,
													 	 this.props.selectedRecord);
			}
			this.forceUpdate();
		}


		if(!this.initialDrawSetup && typeof this.refs.map.leafletElement !== 'undefined'){
			this.setupDraw(this.props);
		}else{
			this.forceUpdate();
		}

	}


	syncDrawWithReact = (selectedRecord,geojsonData) => {
		if(this.isSaving){return;}
		console.log("Going to save stuff now...");
		this.isSaving=true;
		this.enableSpinner();

		let recordId = selectedRecord['o:id'] ? selectedRecord['o:id']:TYPE.NEW_UNSAVED_RECORD;

		this.props.change('record', 'o:coverage', geojsonData);
		this.props.change('record', 'o:is_coverage', true);
		this.props.dispatch(
			updateRecordCache({
				setValues: {
					'o:id': recordId,
					'o:coverage': geojsonData,
					'o:is_coverage': true
				}
		}));

		// Write geometry changes to the database
		var event = new CustomEvent("saveAll");

		document.dispatchEvent(event);


	}

	saveComplete = () => {

		console.log("Save complete");
		this.isSaving=false;




	}


	componentWillReceiveProps = (nextProps) => {
		if(this.isSaving){return;}
		// Selected geometry switches
		if((typeof this.props.selectedRecord !== 'undefined' && nextProps.selectedRecord !== null) &&
			this.currentRecordID !== nextProps.selectedRecord['o:id']){
			this.currentRecordID = nextProps.selectedRecord['o:id'];
			console.log("Switching to record: "+this.currentRecordID);
			this.setupDraw(nextProps);

		}else if(this.currentRecordID !== null &&  nextProps.selectedRecord === null){
			console.log("Switching to record: NONE");
			this.currentRecordID=null;
			this.setupDraw(nextProps);
		}
	}

	setupDraw = (theseProps) =>{
		if(this.isSaving){return;}
		LeafletSupport.drawingSetup(this.refs.map.leafletElement,
									theseProps.selectedRecord,
									theseProps.records,
									this.onGeometryClick,
									theseProps.mapCache.cache,
									theseProps.recordMouseEnter,
									theseProps.recordMouseLeave,
									this.syncDrawWithReact);
	}

	render() {

		console.log("I rendered!"+this.isSaving);

		return (
			<div style={{height:'100%'}}  key={this.state.map_key}>

				<AlertBar isVisible={this.props.mapCache.hasUnsavedChanges}
						  message="You have unsaved changes"/>

				<Map ref='map'
					 center={this.state.map_center}
					 zoom={this.state.map_zoom}
					 className={this.props.mapCache.hasUnsavedChanges?"ps_n3_mapComponent_withWarning":"ps_n3_mapComponent"}
					 onClick={(event) => {if (event.originalEvent.target === event.target.getContainer()){this.onMapClick();}}}>


					 <LayersControl position='topright'>
						{this.baselayers}
					</LayersControl>

				</Map>
			</div>
		)
	}




}

const mapStateToProps = state => ({
	mapCache: state.mapCache,
	exhibit: state.exhibitShow.exhibit,
	records: state.exhibitShow.records,
	selectedRecord: state.exhibitShow.selectedRecord,
	previewedRecord: state.exhibitShow.previewedRecord,
	editorRecord: state.exhibitShow.editorRecord,
	editorNewRecord: state.exhibitShow.editorNewRecord,
	leafletState: state.leaflet
});

const mapDispatchToProps = dispatch => bindActionCreators({
	recordClick: record => selectRecord(record),
	deselectRecord,
	recordMouseEnter: record => previewRecord(record),
	recordMouseLeave: unpreviewRecord,
	change,
	dispatch
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ExhibitPublicMap);
