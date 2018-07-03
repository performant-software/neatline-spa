import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form'
import {connect} from 'react-redux';
import {set_tileLayer, set_availableTileLayers} from '../actions';

const defaultValues = {
	'o:spatial_layers': [],
	'o:zoom_levels': 20,
	'o:spatial_querying': true
};

class ExhibitForm extends Component {

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
		let layerTyepes = this.layerTypes();
		Object.keys(layerTyepes).forEach(function(key) {
			let layerType = layerTyepes[key];
			let opt_key = `layerTypeOption-${key}`;
			retval.push(<option value={key} key={opt_key}>{layerType.displayName}</option>);
		});
		return retval;
	};

	constructor(props) {
		super(props);

		// Redux Actions, bind to this
		this.set_tileLayer = set_tileLayer;
		this.set_availableTileLayers = set_availableTileLayers;

		// Mapping to this
		this.exhibit = props.exhibit;
		this.handleSubmit = props.handleSubmit;
		this.submitLabel = props.submitLabel;
		this.disabled = props.disabled;
		this.layerTypeOptions = this.buildLayerTypeOptions();
	}

	spatialLayerPreview = (event) => {
		this.props.dispatch(this.set_tileLayer({id: event.target.value}));
	}

	enabledSpatialLayerPreview = (event) => {
		let arrayOfIDs = [...event.target.options].filter(({selected}) => selected).map(({value}) => value);
		this.props.dispatch(this.set_availableTileLayers({ids: arrayOfIDs}));
	}
	render() {
		return (
			<form className='ps_n3_exhibit-form' onSubmit={this.handleSubmit}>
			<fieldset disabled={this.disabled} style={{
					border: 'none',
					padding: '0'
				}}>
				<div>
					<label htmlFor='o:title'>Title</label>
					<Field name='o:title' component='input' type='text'/>
				</div>
				<div>
					<label htmlFor='o:slug'>URL Slug</label>
					<Field name='o:slug' component='input' type='text'/>
				</div>
				<div>
					<label htmlFor='o:narrative'>Narrative</label>
					<Field name='o:narrative' component='textarea'/>
				</div>
				<div>
					<label htmlFor='o:accessible_url'>Alternative Accessible URL</label>
					<Field name='o:accessible_url' component='input' type='text'/>
				</div>
				<div>
					<label htmlFor='o:spatial_layer'>Default Spatial Layer</label>
					<Field name='o:spatial_layer' component='select' onChange={this.spatialLayerPreview}>
						<optgroup label='Default Layers'>
							{this.layerTypeOptions}
						</optgroup>
						<option value='no_spatial_layer'>None (Image or WMS as Default)</option>
					</Field>
				</div>
				<div>
					<label htmlFor='o:spatial_layers'>Additional Spatial Layers</label>
					<Field name='o:spatial_layers' component='select' multiple="multiple" onChange={this.enabledSpatialLayerPreview}>
						{this.layerTypeOptions}
					</Field>
				</div>

				<div>
					<label htmlFor='o:image_layer'>Image Layer</label>
					<Field name='o:image_layer' component='input' type='text'/>
				</div>
				<div>
					<label htmlFor='o:zoom_levels'>Zoom Levels</label>
					<Field name='o:zoom_levels' component='input' type='number'/>
				</div>
				<div>
					<label htmlFor='o:wms_address'>WMS Address</label>
					<Field name='o:wms_address' component='input' type='text'/>
				</div>
				<div>
					<label htmlFor='o:wms_layers'>WMS Layers</label>
					<Field name='o:wms_layers' component='input' type='text'/>
				</div>
				<div className="ps_n3_checkboxPair">
					<label htmlFor='o:spatial_querying'>Spatial Querying</label>
					<Field name='o:spatial_querying' component='input' type='checkbox'/>
				</div>
				<div className="ps_n3_checkboxPair">
					<label htmlFor='o:public'>Public</label>
					<Field name='o:public' component='input' type='checkbox'/>
				</div>
				{this.exhibit && this.exhibit['o:id'] && <Field name='o:id' component='input' type='hidden'/>}
				<div className="ps_n3_form_buttons">
					<button type='submit'>{this.submitLabel}</button>
				</div>
			</fieldset>
		</form>);
	}
}

ExhibitForm = reduxForm({form: 'exhibit'})(ExhibitForm);

const mapStateToProps = state => ({
	mapPreview: state.mapPreview,
	initialValues: state.exhibitShow.exhibit
		? state.exhibitShow.exhibit
		: defaultValues
});

export default connect(mapStateToProps, null)(ExhibitForm);
