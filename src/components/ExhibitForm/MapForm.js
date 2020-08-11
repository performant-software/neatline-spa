import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {Field, reduxForm, change, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import {Form, Button} from 'semantic-ui-react';
import {
	set_availableTileLayers,
	setUnsavedChanges,
    updateExhibitCache} from '../../actions';
import * as TYPE from '../../types';



const defaultValues = {
    'o:map_focus': '51.505, -0.09',
    'o:map_max_zoom': null,
    'o:map_min_zoom': null,
    'o:map_restricted_extent': null,
    'o:map_zoom': 12	
};


class MapForm extends Component {
    constructor( props ) {
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
    

    componentDidMount() {
		// Setup initial values
		let initialMapValues = {
			'o:map_focus': this.props.initialValues['o:map_focus'],
			'o:map_max_zoom': this.props.initialValues['o:map_max_zoom'],
			'o:map_min_zoom': this.props.initialValues['o:map_min_zoom'],
			'o:map_restricted_extent': this.props.initialValues['o:map_restricted_extent'],
			'o:map_zoom': this.props.initialValues['o:map_zoom']
		}
        this.setState({mapValues: initialMapValues});
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
			retval.push(<option value={key} key={opt_key}>{layerType.displayName}</option>);
		});
		return retval;
	};


	// Sets the unsaved changes flag
	markUnsaved = (event) => {
		// Update the cache
		if(typeof event !== 'undefined'){
			this.props.dispatch(updateExhibitCache({
				setValues: {
					[event.target.name]: event.target.value
				}
			}));
			// this.props.dispatch(updateExhibitCache({setValues:{[name]:value}}));
		}else{
			console.log("Skipping cache update");
		}

		// Mark unsaved
		this.props.dispatch(setUnsavedChanges({hasUnsavedChanges:true}));

	}

    render() {
        console.log(this.props.state.exhibitShow)
        return (
            <div className="ps_n3_exhibitFormContainer">
				<Form onSubmit={this.handleSubmit}>
					<fieldset disabled={this.disabled}>
					<legend>
						<h4>Style Settings</h4>
					</legend>
                    <div className='field'>
                        <label htmlFor='o:map_focus'>Default Map Focus</label>
                        <div className='ui input'>
                        <Field 
                            value={this.props.initialValues['o:map_focus']}
                            id='o:map_focus'
                            name='o:map_focus'
                            component='input'
                            type='text'
                            onChange={this.markUnsaved}
                            />
                        </div>
                    </div>
                    <div className='field'>
                        <label htmlFor='o:map_zoom'>Default Map Zoom</label>
                        <div className='ui input'>
                        <Field 
                            id='o:map_zoom'
                            name='o:map_zoom'
                            component='input'
                            type='number'
                            onChange={this.markUnsaved}
                            />
                        </div>
                    </div>
                    <Button size='tiny' fluid style={{marginBottom: '1em'}}

                    >Use Current Viewport as Default</Button>
                    <div className='field'>
                        <label htmlFor='o:map_restricted_extent'>Restricted Map Extent</label>
                        <div className='ui input'>
                        <Field 
                            id='o:map_restricted_extent'
                            name='o:map_restricted_extent'
                            component='input'
                            type='text'
                            onChange={this.markUnsaved}
                            />
                        </div>
                    </div>
                    <Button size='tiny' fluid style={{marginBottom: '1em'}}
                    
                    >Use Current Map Bounds as Max Extent</Button>
                    <div className='field'>
                        <label htmlFor='o:map_min_zoom'>Minimum Map Zoom</label>
                        <div className='ui input'>
                        <Field 
                            id='o:map_min_zoom'
                            name='o:map_min_zoom'
                            component='input'
                            type='number'
                            onChange={this.markUnsaved}
                            />
                        </div>
                    </div>
                    <Button size='tiny' fluid style={{marginBottom: '1em'}}
                    
                    >Set Minimum Zoom to Current</Button>
                    <div className='field'>
                        <label htmlFor='o:map_max_zoom'>Maximum Map Zoom</label>
                        <div className='ui input'>
                        <Field 
                            id='o:map_max_zoom'
                            name='o:map_max_zoom'
                            component='input'
                            type='number'
                            onChange={this.markUnsaved}
                            />
                        </div>
                    </div>
                    <Button size='tiny' fluid style={{marginBottom: '1em'}}
                    
                    >Set Maximum Zoom to Current</Button>
                    {this.exhibit && this.exhibit['o:id'] &&
							<Field name='o:id'
								component='input'
								type='hidden' />
						}
                
               </fieldset>
               </Form>
            </div>
        );
    }
}


MapForm = reduxForm({form: 'exhibit-map',enableReinitialize:true})(MapForm);
const formSelector = formValueSelector('exhibit-map');

const mapStateToProps = state => ({
	state,
    mapCache: state.mapCache,
    initialValues: state.exhibitShow.exhibit
        ? state.exhibitShow.exhibit
        : TYPE.EXHIBIT_DEFAULT_VALUES

    // initialValues: state.exhibitShow.exhibit
    //     ? state.exhibitShow.exhibit
    //     : {
	// 		...defaultValues,
	// 		'o:exhibit': {
	// 			'o:id': state.exhibitShow.exhibit['o:id']
	// 		}
	// 	}
});

const mapDispatchToProps = dispatch => bindActionCreators({
	change,
	dispatch
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MapForm);
