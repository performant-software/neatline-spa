import React, {Component} from 'react';
import {Field, reduxForm, formValueSelector} from 'redux-form'
import {connect} from 'react-redux';
import {preview_baseLayer, set_availableTileLayers} from '../actions';
import { strings } from '../i18nLibrary';
import * as types from './types';

class ExhibitForm extends Component {

	constructor(props) {
		super(props);
		this.preview_baseLayer = preview_baseLayer;
		this.set_availableTileLayers = set_availableTileLayers;
		this.exhibit = props.exhibit;
		this.handleSubmit = props.handleSubmit;
		this.submitLabel = props.submitLabel;
		this.disabled = props.disabled;
		this.layerTypeOptions = this.buildLayerTypeOptions();
		this.state={baseLayerType:types.BASELAYER_TYPE.MAP};
	}

	componentDidMount(){

		// Update the layer preview with initial values
		this.updateLayerPreview({
			spatial_layer:this.props.initialValues['o:spatial_layer'],

			wms_address:this.props.initialValues['o:wms_address'],
			wms_layers:this.props.initialValues['o:wms_layers'],
			wms_attribution:this.props.initialValues['o:wms_attribution'],

			image_layer:this.props.initialValues['o:image_layer'],
			image_address:this.props.initialValues['o:image_layer'],
			image_attribution:this.props.initialValues['o:image_attribution'],

			tile_address:this.props.initialValues['o:tile_address'],
			tile_attribution:this.props.initialValues['o:tile_attribution']
		});
	}

	// Update the live-preview of the spatial layer
	onSpatialLayerInfoChange = (event) => {
		let payload={
			spatial_layer:(event.target.name === "o:spatial_layer")?event.target.value:formSelector(this.props.state, 'o:spatial_layer'),

			wms_address:(event.target.name === "o:wms_address")?event.target.value:formSelector(this.props.state, 'o:wms_address'),
			wms_layers:(event.target.name === "o:wms_layers")?event.target.value:formSelector(this.props.state, 'o:wms_layers'),
			wms_attribution:(event.target.name === "o:wms_attribution")?event.target.value:formSelector(this.props.state,'o:wms_attribution'),

			image_address:(event.target.name === "o:image_layer")?event.target.value:formSelector(this.props.state, 'o:image_layer'),
			image_attribution:(event.target.name === "o:image_attribution")?event.target.value:formSelector(this.props.state,'o:image_attribution'),

			tile_address:(event.target.name === "o:tile_address")?event.target.value:formSelector(this.props.state, 'o:tile_address'),
			tile_attribution:(event.target.name === "o:tile_attribution")?event.target.value:formSelector(this.props.state, 'o:tile_attribution')
		};
		this.updateLayerPreview(payload);
	}

	updateLayerPreview = (payload) =>{
		// Set type...
		// If it's a number, it's an id of a map, otherwise it's IMAGE or WMS
		let baseLayerType=payload.spatial_layer;
		if(!isNaN(payload.spatial_layer)){
			baseLayerType=types.BASELAYER_TYPE.MAP;
		}

		// Update local state and preview via redux
		this.setState({baseLayerType:baseLayerType});
		this.props.dispatch(
			this.preview_baseLayer({
				type: baseLayerType,
				id: payload.spatial_layer,

				wms_address:payload.wms_address,
				wms_layers:payload.wms_layers,
				wms_attribution:payload.wms_attribution,

				image_layer:payload.image_layer,
				image_address:payload.image_address,
				image_attribution:payload.image_attribution,

				tile_address:payload.tile_address,
				tile_attribution:payload.tile_attribution
			})
		);
	}

	enabledSpatialLayerPreview = (event) => {
		let arrayOfIDs = [...event.target.options].filter(({selected}) => selected).map(({value}) => value);
		this.props.dispatch(this.set_availableTileLayers({ids: arrayOfIDs}));
	}

	// Build layertypes from the set of non-deprecated maps
	layerTypes = () => {
		let retval = [];
		var availableBaseMaps = this.props.mapPreview.available.baseMaps;
		Object.keys(availableBaseMaps).forEach(function(key) {
			let thisMap = availableBaseMaps[key];
			if (!thisMap.deprecated) {
				retval.push(thisMap);
			}
		});
		return retval;
	};

	buildLayerTypeOptions = () => {
		var retval = [];
		//this.layerTypes().map((layerType) => {
		let layerTypes = this.layerTypes();
		Object.keys(layerTypes).forEach(function(key) {
			let layerType = layerTypes[key];
			let opt_key = `layerTypeOption-${key}`;
			retval.push(<option value={key} key={opt_key}>{layerType.displayName}</option>);
		});
		return retval;
	};


	render() {
		return (
			<div>
			{/* Form buttons */}
			<div className="ps_n3_buttonGroup_exhibitForm">
				<button type='submit'>{this.submitLabel}</button>
			</div>

			<form className='ps_n3_exhibit-form' onSubmit={this.handleSubmit}>
			<fieldset disabled={this.disabled} style={{
					border: 'none',
					padding: '0'
				}}>
				<div>
					<label htmlFor='o:title'>{strings.title}</label>
					<Field name='o:title' component='input' type='text'/>
				</div>
				<div>
					<label htmlFor='o:slug'>{strings.slug}</label>
					<Field name='o:slug' component='input' type='text'/>
				</div>
				<div>
					<label htmlFor='o:narrative'>{strings.narrative}</label>
					<Field name='o:narrative' component='textarea'/>
				</div>
				<div>
					<label htmlFor='o:accessible_url'>{strings.accessible_url}</label>
					<Field name='o:accessible_url' component='input' type='text'/>
				</div>

				<div>
					<label 	htmlFor='o:spatial_layer'>{strings.default_spatial_layer}</label>
					<Field 	name='o:spatial_layer'
							component='select'
							onChange={this.onSpatialLayerInfoChange}>
							<optgroup label='Default Layers'>
								{this.layerTypeOptions}
								<option value={types.BASELAYER_TYPE.TILE}>Custom: Tile Layer</option>
								<option value={types.BASELAYER_TYPE.IMAGE}>Custom: Image Layer</option>
								<option value={types.BASELAYER_TYPE.WMS}>Custom: WMS Layer</option>
							</optgroup>
					</Field>
				</div>

				{(this.state.baseLayerType === types.BASELAYER_TYPE.IMAGE) &&
					<div className="ps_n3_sub_options">
						<div>
							<label 	htmlFor='o:image_layer'>Image Layer</label>
							<Field 	name='o:image_layer'
									component='input'
									type='text'
									onChange={this.onSpatialLayerInfoChange}/>
						</div>
						<div>
							<label 	htmlFor='o:image_attribution'>Attribution</label>
							<Field 	name='o:image_attribution'
									component='input'
									type='text'
									onChange={this.onSpatialLayerInfoChange}/>
						</div>
					</div>
				}

				{(this.state.baseLayerType === types.BASELAYER_TYPE.TILE) &&
					<div className="ps_n3_sub_options">
						<div>
							<label 	htmlFor='o:tile_address'>Tile Layer</label>
							<Field 	name='o:tile_address'
									component='input'
									type='text'
									onChange={this.onSpatialLayerInfoChange}/>

							<label 	htmlFor='o:tile_attribution'>Attribution</label>
							<Field 	name='o:tile_attribution'
									component='input'
									type='text'
									onChange={this.onSpatialLayerInfoChange}/>
						</div>
					</div>
				}

				{(this.state.baseLayerType === types.BASELAYER_TYPE.WMS) &&
					<div className="ps_n3_sub_options">
						<div>
							<label	htmlFor='o:wms_address'>WMS Address</label>
							<Field 	name='o:wms_address'
									component='input'
									type='text'
									onChange={this.onSpatialLayerInfoChange}/>
						</div>
						<div>
							<label 	htmlFor='o:wms_layers'>WMS Layers</label>
							<Field 	name='o:wms_layers'
									component='input'
									type='text'
									onChange={this.onSpatialLayerInfoChange}/>
						</div>
						<div>
							<label 	htmlFor='o:wms_attribution'>Attribution</label>
							<Field 	name='o:wms_attribution'
									component='input'
									type='text'
									onChange={this.onSpatialLayerInfoChange}/>
						</div>
					</div>
				}

				<div>
					<label 	htmlFor='o:spatial_layers'>{strings.additional_spatial_layers}</label>
					<Field 	name='o:spatial_layers'
							component='select'
							multiple="multiple"
							onChange={this.enabledSpatialLayerPreview}>
						{this.layerTypeOptions}
					</Field>
				</div>

				<div>
					<label 	htmlFor='o:zoom_levels'>{strings.zoom_levels}</label>
					<Field 	name='o:zoom_levels'
							component='input'
							type='number'/>
				</div>
				<div className="ps_n3_checkboxPair">
					<Field 	name='o:spatial_querying'
							component='input'
							type='checkbox'/>
					<label 	htmlFor='o:spatial_querying'>{strings.spatial_querying}</label>
				</div>
				<div className="ps_n3_checkboxPair">
					<Field 	name='o:public'
							component='input'
							type='checkbox'/>
					<label 	htmlFor='o:public'>{strings.public}</label>
				</div>
				{this.exhibit && this.exhibit['o:id'] &&
					<Field 	name='o:id'
							component='input'
							type='hidden'/>}
			</fieldset>
		</form>
	 </div>);
	}
}

ExhibitForm = reduxForm({form: 'exhibit'})(ExhibitForm);
const formSelector = formValueSelector('exhibit');
const mapStateToProps = state => ({
	state,
	mapPreview: state.mapPreview,
	initialValues: state.exhibitShow.exhibit
		? state.exhibitShow.exhibit
		: types.EXHIBIT_DEFAULT_VALUES
});

export default connect(mapStateToProps, null)(ExhibitForm);
