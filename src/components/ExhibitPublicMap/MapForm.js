import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {Field, reduxForm, change, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import {Form, Button} from 'semantic-ui-react';
import {
	preview_baseLayer,
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
        super( props );
        this.exhibit = props.exhibit;
		this.handleSubmit = props.handleSubmit;
		this.submitLabel = props.submitLabel;
        this.disabled = props.disabled;
        
        this.state = {
            mapValues: {}
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




    render() {
        // console.log(this.state.initialValues)
        return (
            <div className="ps_n3_exhibitFormContainer">
				<Form onSubmit={this.handleSubmit}>
					<fieldset disabled={this.disabled}>
					<legend>
						<h4>Map Settings</h4>
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
                            />
                        </div>
                    </div>
                    <Button size='tiny' fluid style={{marginBottom: '1em'}}
                        onClick={console.log('clicked')}
                    >Use Current Viewport as Default</Button>
                    <div className='field'>
                        <label htmlFor='o:map_restricted_extent'>Restricted Map Extent</label>
                        <div className='ui input'>
                        <Field 
                            id='o:map_restricted_extent'
                            name='o:map_restricted_extent'
                            component='input'
                            type='text'
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
