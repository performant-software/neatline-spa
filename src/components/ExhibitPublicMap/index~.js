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

		this.currentRecordID=null;

		this.shouldUpdate=false;

		this.cacheInitialized=false;
		this.baselayers=null;
		this.geometry=null;
		this.initialGeometry=null;
		this.ldeh = LeafletDrawEventHandler.getSingleton();
	}

	reRender=()=>{this.forceUpdate();}

	enableMapRender=()=>{
		//this.shouldUpdate=true;
		this.props.dispatch(leafletIsEditing(false));
	}
	disableMapRender=()=>{
		this.shouldUpdate=false;
		this.props.dispatch(leafletIsEditing(true));
	}
	enableSpinner=()=>{this.props.dispatch(leafletIsSaving(true));}

	shouldComponentUpdate(){
		return this.shouldUpdate;
	}
	onGeometryClick=(record)=>{
		this.props.recordClick(record);
		this.forceUpdate();
	}
	onMapClick=()=>{
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
		this.forceUpdate();
	}

	componentDidUpdate = () =>{

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
			this.baselayers = LeafletSupport.baselayerSetup(this.props.mapCache.current,
															this.refs.map.leafletElement);
		}

		// Selected geometry switches
		if((typeof this.props.selectedRecord !== 'undefined' && this.props.selectedRecord !== null) &&
			this.currentRecordID !== this.props.selectedRecord['o:id']){
			this.currentRecordID = this.props.selectedRecord['o:id'];
			console.log("Switching to record: "+this.currentRecordID);
			this.geometry=null;
			this.initialGeometry=null;
		}else if(this.currentRecordID !== null &&  this.props.selectedRecord === null){
			console.log("Deselect");
			this.currentRecordID=null;
			this.geometry=null;
		}

		if(this.geometry === null){
			console.log("1. Establishing geometry... "+this.currentRecordID);
			this.geometry = LeafletSupport.geometrySetup(this.props.records,
														 this.onGeometryClick,
														 this.props.mapCache.cache,
														 this.props.selectedRecord,
														 this.props.recordMouseEnter,
														 this.props.recordMouseLeave);
			this.forceUpdate();

		}else if (this.initialGeometry === null){
			let layerArray = [];
			console.log(this.refs.editableFeaturegroup);
			if(typeof this.refs.editableFeaturegroup !== 'undefined'){
				console.log("2. Capturing established geometry... "+this.currentRecordID);
				this.refs.editableFeaturegroup.leafletElement.eachLayer(function(layer) {
					layerArray.push(layer);
				});

				this.ldeh.initialize(this.props,
											this.enableMapRender,
											this.disableMapRender,
											this.enableSpinner,
											this.reRender);
				this.ldeh.setFeatureGroupLayers(layerArray);
				this.initialGeometry=layerArray;
			}

			this.forceUpdate();
		/*
		}else{
			if(!this.shouldUpdate){
				this.shouldUpdate=true;
				this.forceUpdate();
			}
			this.geometry = LeafletSupport.geometrySetup(this.props.records,
														 this.onGeometryClick,
														 this.props.mapCache.cache,
														 this.props.selectedRecord,
														 this.props.recordMouseEnter,
														 this.props.recordMouseLeave);
														 */
		}

	}

	doesCacheNeedUpdating = (existingCache,newCache) => {
		newCache.forEach( (incomingRecord, idx) =>{
			let existingRecord=existingCache[idx];
			if(incomingRecord['o:id'] === existingRecord['o:id']){
				for (const key of Object.keys(existingRecord)) {
					console.log(existingRecord[key]+" "+ incomingRecord[key]);
				   if(existingRecord[key] !== incomingRecord[key]){
					   return true;
				   }
				}
			}else{
				return true;
			}
		});
		return false;
	}

	render() {
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
						{/*(this.props.editorRecord || this.props.editorNewRecord) &&*/}
							<FeatureGroup ref='editableFeaturegroup'>

								<EditControl position='topleft'
											 onEdited={this.onEdited}
											 onCreated={this.onCreated}
										 	 onDeleted={this.onDeleted}
											 onMounted={this.onMounted}
											 onEditStart={this.onEditStart}
											 onEditStop={this.onEditStop}
											 onDrawStart={this.onDrawStart}
											 onDrawStop={this.onDrawStop}
										 	 onDeleteStart={this.onDeleteStop}
											 draw={
												 LeafletSupport.drawingOptions(
									 				true,
									 				(this.props.mapCache.current.type !== TYPE.BASELAYER_TYPE.IMAGE)
									 		)}/>

									 		{(this.geometry !== null && !this.props.leafletState.isEditing) && this.geometry.editable}

							</FeatureGroup>
						{/*}*/}
					</LayersControl>
					{(this.geometry !== null) && this.geometry.uneditable}
				</Map>
			</div>
		)
	}

	onEdited = (e) => {this.ldeh.onEdited(e);}
	onCreated = (e) => {this.ldeh.onCreated(e);}
	onDeleted = (e) => {this.ldeh.onDeleted(e);}
	onMounted = (e) => {this.ldeh.onMounted(e);}
	onEditStart = (e) => {
		debugger
		this.ldeh.onEditStart(e);
	}
	onEditStop = (e) => {this.ldeh.onEditStop(e);}
	onDrawStart = (e) => {this.ldeh.onDrawStart(e);}
	onDrawStop = (e) => {this.ldeh.onDrawStop(e);}
	onDeleteStart = (e) => {this.ldeh.onDeleteStart(e);}


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
