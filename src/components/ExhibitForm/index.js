import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {Field, reduxForm, change, formValueSelector} from 'redux-form'
import {connect} from 'react-redux';
import {preview_baseLayer, set_availableTileLayers, setUnsavedChanges} from '../../actions';
import * as types from '../types';

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
		this.state={
			exhibitType:types.EXHIBIT_TYPE.MAP,
			baseLayerType:types.BASELAYER_TYPE.MAP,
			isNewExhibit:true
		};
	}

	componentDidMount(){

		// Is this a new (add) or existing (edit) version of this form?
		let isNewExhibit = (typeof this.props.initialValues['o:exhibit_type'] === 'undefined');
		let exhibitType = (typeof this.props.initialValues['o:exhibit_type'] === 'undefined')?types.EXHIBIT_TYPE.MAP:this.props.initialValues['o:exhibit_type'];

		// Init form field
		this.props.change('o:exhibit_type', exhibitType);

		// Update the layer preview with initial values
		this.updateLayerPreview({
			exhibit_type:this.props.initialValues['o:exhibit_type'],
			spatial_layer:(exhibitType === types.EXHIBIT_TYPE.MAP)?this.props.initialValues['o:spatial_layer']:types.BASELAYER_TYPE.IMAGE,

			wms_address:this.props.initialValues['o:wms_address'],
			wms_layers:this.props.initialValues['o:wms_layers'],
			wms_attribution:this.props.initialValues['o:wms_attribution'],

			image_layer:this.props.initialValues['o:image_layer'],
			image_address:this.props.initialValues['o:image_layer'],
			image_attribution:this.props.initialValues['o:image_attribution'],

			tile_address:this.props.initialValues['o:tile_address'],
			tile_attribution:this.props.initialValues['o:tile_attribution']
		});

		// Update the state
		this.setState({
			exhibitType:exhibitType,
			isNewExhibit:isNewExhibit
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

		// If we're editing a property of image, ensure that's what baselayer we're on
		if((event.target.name === "o:image_layer") || (event.target.name === "o:image_attribution")){
			payload.spatial_layer=types.BASELAYER_TYPE.IMAGE;
		}
		this.updateLayerPreview(payload);
		this.markUnsaved();
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

	// Switches between map and image
	exhibitTypeSwitch = (event) => {
		if(event.target.dataset.type === 'image'){
			this.setState({
				baseLayerType:types.BASELAYER_TYPE.IMAGE,
				exhibitType:types.EXHIBIT_TYPE.IMAGE
			});
			this.onSpatialLayerInfoChange({target:{name:'o:spatial_layer',value:types.BASELAYER_TYPE.IMAGE}});
			this.props.change('o:exhibit_type', types.EXHIBIT_TYPE.IMAGE);

		}else{
			this.setState({
				baseLayerType:types.BASELAYER_TYPE.MAP,
				exhibitType:types.EXHIBIT_TYPE.MAP
			});
			this.onSpatialLayerInfoChange({target:{name:'o:spatial_layer',value:0}});
			this.props.change('o:exhibit_type', types.EXHIBIT_TYPE.MAP);
		}

	}

	// Sets the unsaved changes flag
	markUnsaved = () => {
		this.props.dispatch(
			setUnsavedChanges({hasUnsavedChanges:true})
		);
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
		console.log(`New Exhibit: ${this.state.isNewExhibit}`);
		return (
			<div>
				<form className='ps_n3_exhibit-form' onSubmit={this.handleSubmit}>

					{/* Form buttons */}
					<div className="ps_n3_buttonGroup_exhibitForm">
						<button type='submit'>{this.submitLabel}</button>
					</div>


					<fieldset disabled={this.disabled} style={{
							border: 'none',
							padding: '0'
						}}>
						<div>
							<label htmlFor='o:title'>* Title</label>
							<Field 	name='o:title'
									component='input'
									type='text'
									onChange={this.markUnsaved}/>
						</div>
						<div>
							<label htmlFor='o:slug'>* URL Slug</label>
							<Field 	name='o:slug'
									component='input'
									type='text'
									onChange={this.markUnsaved}/>
						</div>
						<div>
							<label htmlFor='o:narrative'>Narrative</label>
							<Field 	name='o:narrative'
									component='textarea'
									onChange={this.markUnsaved}/>
						</div>
						<div>
							<label htmlFor='o:accessible_url'>Alternative Accessible URL</label>
							<Field 	name='o:accessible_url'
									component='input'
									type='text'
									onChange={this.markUnsaved}/>
						</div>

						{(this.state.isNewExhibit) &&
							<div className="ps_n3_radioSet">
								<input 	data-type="map"
										checked={this.state.exhibitType === types.EXHIBIT_TYPE.MAP}
										type="radio"
										onChange={this.exhibitTypeSwitch}/>
										<label>Map</label>

								<input 	data-type="image"
										checked={this.state.exhibitType === types.EXHIBIT_TYPE.IMAGE}
										type="radio"
										onChange={this.exhibitTypeSwitch}/>
										<label>Image</label>
							</div>
						}

						{(this.state.exhibitType === types.EXHIBIT_TYPE.MAP) &&
							<div>
								<label 	htmlFor='o:spatial_layer'>Base Layer</label>
								<Field 	name='o:spatial_layer'
										component='select'
										onChange={this.onSpatialLayerInfoChange}>
										<optgroup label='Default Layers'>
											{this.layerTypeOptions}
											<option value={types.BASELAYER_TYPE.TILE}>Custom: Tile Layer</option>
											<option value={types.BASELAYER_TYPE.WMS}>Custom: WMS Layer</option>
										</optgroup>
								</Field>
							</div>
						}

						{(this.state.exhibitType === types.EXHIBIT_TYPE.IMAGE) &&
							<div>
								<div>
									<div>
										<label 	htmlFor='o:image_layer'>Image URL</label>
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
							</div>
						}

						{(this.state.baseLayerType === types.BASELAYER_TYPE.TILE) &&
							<div className="ps_n3_sub_options">
								<div>
									<label 	htmlFor='o:tile_address'>Tile URL</label>
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
									<label	htmlFor='o:wms_address'>WMS URL</label>
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

						{(this.state.exhibitType === types.EXHIBIT_TYPE.MAP) &&
							<div>
								<div>
									<label 	htmlFor='o:spatial_layers'>Additional Layers</label>
									<Field 	name='o:spatial_layers'
											component='select'
											multiple="multiple"
											onChange={this.enabledSpatialLayerPreview}>
										{this.layerTypeOptions}
									</Field>
								</div>

								<div>
									<label 	htmlFor='o:zoom_levels'>Zoom Levels</label>
									<Field 	name='o:zoom_levels'
											component='input'
											type='number'
											onChange={this.markUnsaved}/>
								</div>
							</div>
						}

						<div className="ps_n3_checkboxPair">
							<Field 	name='o:spatial_querying'
									component='input'
									type='checkbox'
									onChange={this.markUnsaved}/>
							<label 	htmlFor='o:spatial_querying'>Spatial Querying</label>
						</div>
						<div className="ps_n3_checkboxPair">
							<Field 	name='o:public'
									component='input'
									type='checkbox'
									onChange={this.markUnsaved}/>
							<label 	htmlFor='o:public'>Public</label>


						</div>
						{this.exhibit && this.exhibit['o:id'] &&
							<Field 	name='o:id'
									component='input'
									type='hidden'/>
						}

						{/* Hidden fields */}
						<Field 	name='o:exhibit_type'
								component='input'
								type='hidden'/>

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

const mapDispatchToProps = dispatch => bindActionCreators({
	change,
	dispatch
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ExhibitForm);
