import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import history from '../../history';
import {Field, reduxForm, change, formValueSelector} from 'redux-form'
import {connect} from 'react-redux';
import { Button, Dropdown, Form } from 'semantic-ui-react';
import {
	preview_baseLayer,
	set_availableTileLayers,
	setUnsavedChanges,
	updateExhibitCache} from '../../actions';
import * as TYPE from '../../types';

class ExhibitForm extends Component {

	constructor(props) {
		super(props);
		this.set_availableTileLayers = set_availableTileLayers;
		this.exhibit = props.exhibit;
		this.handleSubmit = props.handleSubmit;
		this.submitLabel = props.submitLabel;
		this.disabled = props.disabled;
		this.layerTypeOptions = this.buildLayerTypeOptions();
		this.currentSlug='';
		this.state={
			exhibitType:TYPE.EXHIBIT_TYPE.MAP,
			baseLayerType:TYPE.BASELAYER_TYPE.MAP,
			isNewExhibit:true,
		};
	}

	componentDidMount(){
		// Is this a new (add) or existing (edit) version of this form?
		let isNewExhibit = (typeof this.props.initialValues['o:exhibit_type'] === 'undefined');
		let exhibitType = (typeof this.props.initialValues['o:exhibit_type'] === 'undefined')?TYPE.EXHIBIT_TYPE.MAP:this.props.initialValues['o:exhibit_type'];

		// Init form field
		this.props.change('o:exhibit_type', exhibitType);

		// Update the layer preview with initial values
		this.updateLayerPreview({
			exhibit_type:this.props.initialValues['o:exhibit_type'],
			spatial_layer:(exhibitType === TYPE.EXHIBIT_TYPE.MAP)?this.props.initialValues['o:spatial_layer']:TYPE.BASELAYER_TYPE.IMAGE,

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

		// Set the slug for the router
		this.setState({currentSlug:this.props.initialValues['o:slug']})

		// Reset save warning
		this.props.dispatch(setUnsavedChanges({hasUnsavedChanges:false}));
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
			payload.spatial_layer=TYPE.BASELAYER_TYPE.IMAGE;
		}
		this.updateLayerPreview(payload);
		this.markUnsaved(event, { 'name': event.target.name, 'value':event.target.value});
	}

	updateLayerPreview = (payload) =>{

		// Set type...
		// If it's a number, it's an id of a map, otherwise it's IMAGE or WMS
		let baseLayerType=payload.spatial_layer;
		if(!isNaN(payload.spatial_layer)){
			baseLayerType=TYPE.BASELAYER_TYPE.MAP;
		}

		// Update local state and preview via redux
		this.setState({baseLayerType:baseLayerType});
		this.props.dispatch(
			preview_baseLayer({
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

	enabledSpatialLayerPreview = (event, { value }) => {
    this.props.change('o:spatial_layers', value);
		this.props.dispatch(this.set_availableTileLayers({ ids: value }));
		this.markUnsaved(event, { name:'o:spatial_layers', value });
	}

	// Switches between map and image
	exhibitTypeSwitch = (event) => {
		if (event.target.name === 'image') {
			this.setState({
				baseLayerType: TYPE.BASELAYER_TYPE.IMAGE,
				exhibitType: TYPE.EXHIBIT_TYPE.IMAGE
			});
			this.onSpatialLayerInfoChange({
				target: {
					name: 'o:spatial_layer',
					value: TYPE.BASELAYER_TYPE.IMAGE
				}
			});
			this.props.change('o:exhibit_type', TYPE.EXHIBIT_TYPE.IMAGE);

		} else {
			this.setState({
				baseLayerType: TYPE.BASELAYER_TYPE.MAP,
				exhibitType: TYPE.EXHIBIT_TYPE.MAP
			});
			this.onSpatialLayerInfoChange({
				target: {
					name: 'o:spatial_layer',
					value: 0
				}
			});
			this.props.change('o:exhibit_type', TYPE.EXHIBIT_TYPE.MAP);
		}
	}

  // Sets the unsaved changes flag
  markUnsaved = (event, data) => {
    // Update the cache
    let name, value;

    if (typeof event !== 'undefined') {
      if (data && data.name && data.value) {
        name = data.name;
        value = data.value;
      } else if (data && data.value) {
        name = event.target.name;
        value = data.value;
      } else {
        name = event.target.name;
        value = event.target.value;
      }

      this.props.dispatch(updateExhibitCache({
        setValues: { [name]: value }
      }));
    } else {
      console.log("Skipping cache update");
    }

    // Mark unsaved
    this.props.dispatch(setUnsavedChanges({ hasUnsavedChanges: true }));
  }

	// Build layerTYPE from the set of non-deprecated maps
	layerTYPE = () => {
		let retval = [];
		var availableBaseMaps = this.props.mapCache.available.baseMaps;
		Object.keys(availableBaseMaps).forEach(function (key) {
			let thisMap = availableBaseMaps[key];
			if (!thisMap.deprecated) {
				retval.push(thisMap);
			}
		});
		return retval;
	};

	buildLayerTypeOptions = () => {
    var retval = [];
    let layerTYPE = this.layerTYPE();
    Object.keys(layerTYPE).forEach(function(key) {
      let layerType = layerTYPE[key];
      let opt_key = `layerTypeOption-${key}`;
      retval.push({
        value: key,
        key: opt_key,
        text: layerType.displayName
      });
    });
    return retval;
  }

	componentWillReceiveProps(nextprops){
		if(typeof nextprops.exhibit !== 'undefined'){
			let nextSlug = nextprops.exhibit['o:slug'];
			if(this.currentSlug !== nextSlug && nextSlug.length > 0){
				this.setState({currentSlug:nextSlug});
				history.push(window.baseRoute + '/show/' + nextSlug);
				this.currentSlug=nextSlug;
			}
		}
	}
	render() {
		return (
			<div className="ps_n3_exhibitFormContainer">
				<Form onSubmit={this.handleSubmit}>
					<fieldset disabled={this.disabled}>
					<legend>
						{this.state.isNewExhibit ?
							<h2>New Exhibit</h2>
							: <h4>Exhibit Settings</h4>
						}
					</legend>
						<div className='field'>
							<label htmlFor='o:title'>Title</label>
							<div className='ui input'>
							<Field 
								id='o:title'
								name='o:title'
								component='input'
								type='text'
								placeholder='Enter exhibit title'
								onChange={this.markUnsaved} />
							</div>
						</div>
						<div className='field'>
							<label htmlFor='o:slug'>URL Slug</label>
							<div className='ui input'>
							<Field 
								id='o:slug'
								name='o:slug'
								component='input'
								type='text'
								placeholder='Enter url slug'
								onChange={this.markUnsaved}
								/>
							</div>
						</div>
						<div className='field'>
							<label htmlFor='o:narrative'>Narrative</label>
							<div className='ui input'>
							<Field 
								id='o:narrative'
								name='o:narrative'
								component='textarea'
								placeholder='Enter exhibit narrative'
								onChange={this.markUnsaved}
								/>
							</div>
						</div>
						<div className='field'>
							<label htmlFor='o:accessible_url'>Alternative Accessible URL</label>
							<div className='ui input'>
								<Field id='o:accessible_url' name='o:accessible_url'
									component='input'
									type='text'
									placeholder='Enter alternative url'
									onChange={this.markUnsaved}
								/>
							</div>
						</div>
						{this.state.isNewExhibit ?
						<div>
							<div className='field'>
								<label htmlFor='o:public'>Public</label>
								<div className='ui checkbox toggle ps_n3_checkbox'>
									<Field id="o:public" name="o:public"
									component='input'
									type="checkbox"
									/>
									<label>Check here to publish exhibit to the public site.</label>
								</div>
							</div>
							<div className='grouped fields'>
								<label><h3>Select Map Type</h3></label>
									<div className='field'>
										<div className='ui radio checkbox'>
											<Field
												id='map-radio'
												name='map'
												type="radio"
												component='input'
												checked={this.state.exhibitType === TYPE.EXHIBIT_TYPE.MAP}
												onChange={this.exhibitTypeSwitch}
												value={0}
											/>
											<label htmlFor='map-radio'>Map</label>
										</div>
									</div>
									<div className='field'>
										<div className='ui radio checkbox'>
											<Field id="image-radio"
												name="image"
												type="radio"
												component='input'
												checked={this.state.exhibitType === TYPE.EXHIBIT_TYPE.IMAGE}
												onChange={this.exhibitTypeSwitch}
												value={1}
											/>
											<label htmlFor="image-radio">Image</label>
										</div>
									</div>
								</div>
							</div>
						: null }
						{(this.state.exhibitType === TYPE.EXHIBIT_TYPE.MAP) &&
							<div className='field'>
								<label htmlFor='o:spatial_layer'>Base Layer</label>
								<Field 
									id='o:spatial_layer'
									name='o:spatial_layer'
									component='select'
									onChange={this.onSpatialLayerInfoChange}>
									<optgroup label='Default Layers'>
                    { this.layerTypeOptions.map((o) => (
                      <option
                        value={o.value}
                        key={o.key}
                      >
                        { o.text }
                      </option>
                    ))}
										<option value={TYPE.BASELAYER_TYPE.TILE}>Custom: Tile Layer</option>
										<option value={TYPE.BASELAYER_TYPE.WMS}>Custom: WMS Layer</option>
									</optgroup>
								</Field>
							</div>
						}
						{(this.state.exhibitType === TYPE.EXHIBIT_TYPE.IMAGE) &&
							<div>
								<div>
									<div className='field'>
										<label htmlFor='o:image_layer'>Image URL</label>
										<Field 
											id='o:image_layer'
											name='o:image_layer'
											component='input'
											type='text'
											onChange={this.onSpatialLayerInfoChange} />
									</div>
									<div className='field'>
										<label htmlFor='o:image_attribution'>Attribution</label>
										<Field 
											id='o:image_attribution'
											name='o:image_attribution'
											component='input'
											type='text'
											onChange={this.onSpatialLayerInfoChange} />
									</div>
								</div>
							</div>
						}
						{(this.state.baseLayerType === TYPE.BASELAYER_TYPE.TILE) &&
							<div className="ps_n3_sub_options">
								<div className='field'>
									<label htmlFor='o:tile_address'>Tile URL</label>
									<Field 
										id='o:tile_address'
										name='o:tile_address'
										component='input'
										type='text'
										onChange={this.onSpatialLayerInfoChange} />
								</div>
								<div className='field'>
									<label htmlFor='o:tile_attribution'>Attribution</label>
									<Field 
										id='o:tile_attribution'
										name='o:tile_attribution'
										component='input'
										type='text'
										onChange={this.onSpatialLayerInfoChange} />
								</div>
							</div>
						}

						{(this.state.baseLayerType === TYPE.BASELAYER_TYPE.WMS) &&
							<div className="ps_n3_sub_options">
								<div className='field'>
									<label htmlFor='o:wms_address'>WMS URL</label>
									<Field 
										id='o:wms_address'
										name='o:wms_address'
										component='input'
										type='text'
										onChange={this.onSpatialLayerInfoChange} />
								</div>
								<div className='field'> 
									<label htmlFor='o:wms_layers'>WMS Layers</label>
									<Field id='o:wms_layers'
										name='o:wms_layers'
										component='input'
										type='text'
										onChange={this.onSpatialLayerInfoChange} />
								</div>
								<div className='field'>
									<label htmlFor='o:wms_attribution'>Attribution</label>
									<Field id='o:wms_attribution'
										name='o:wms_attribution'
										component='input'
										type='text'
										onChange={this.onSpatialLayerInfoChange} />
								</div>
							</div>
						}

						{(this.state.exhibitType === TYPE.EXHIBIT_TYPE.MAP) &&
							<div>
								<div className='field'>
									<label htmlFor='o:spatial_layers'>Additional Layers</label>
                  <Field
                    id='o:spatial_layers'
                    name='o:spatial_layers'
                    component={() => (
                      <Dropdown
                        onChange={this.enabledSpatialLayerPreview.bind(this)}
                        options={this.layerTypeOptions}
                        multiple
                        selection
                        value={formSelector(this.props.state, 'o:spatial_layers')}
                      />
                    )}
                  />
								</div>
								<div className='field'>
									<label htmlFor='o:zoom_levels'>Zoom Levels</label>
									<Field id='o:zoom_levels'
										name='o:zoom_levels'
										component='input'
										type='number'
										onChange={this.markUnsaved} />
								</div>
							</div>
						}
						<div className="ps_n3_checkboxPair">
										{/*
							Spatial querying disabled for alpha:
							https://github.com/performant-software/neatline-3/issues/114
						*/}
							{/* <div className='field'> */}
								{/*<label 	htmlFor='o:spatial_querying'>Spatial Querying</label>*/}
								<Field id='o:spatial_querying' 
										name='o:spatial_querying'
										component='input'
										type='hidden'
										onChange={this.markUnsaved} />
							{/* </div> */}
						</div>
						{this.exhibit && this.exhibit['o:id'] &&
							<Field name='o:id'
								component='input'
								type='hidden' />
						}

						{/* Hidden fields */}
						<Field name='o:exhibit_type'
							component='input'
							type='hidden' />
					</fieldset>
				{this.state.isNewExhibit &&
				<Button type="submit">Create Exhibit</Button>
				}
			</Form>
		</div>
		);
	}
}

ExhibitForm = reduxForm({form: 'exhibit',enableReinitialize:true})(ExhibitForm);
const formSelector = formValueSelector('exhibit');

const mapStateToProps = state => ({
	state,
	mapCache: state.mapCache,
	initialValues: state.exhibitShow.exhibit?state.exhibitShow.exhibit:TYPE.EXHIBIT_DEFAULT_VALUES
});

const mapDispatchToProps = dispatch => bindActionCreators({
	change,
	dispatch
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ExhibitForm);
