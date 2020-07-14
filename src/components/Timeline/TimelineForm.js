import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {Field, reduxForm, change, formValueSelector} from 'redux-form'
import {connect} from 'react-redux';
import { Form } from 'semantic-ui-react'
import {
	setUnsavedChanges,
	updateExhibitCache} from '../../actions';

const defaultValues = {
	'o:track_height': 16
};

class TimelineForm extends Component {

    constructor(props) {
		super(props);
		this.exhibit = props.exhibit;
		this.handleSubmit = props.handleSubmit;
		this.submitLabel = props.submitLabel;
		this.disabled = props.disabled;
    }
    
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
		return (
			<div className="ps_n3_exhibitFormContainer">
                <Form onSubmit={this.handleSubmit}>
                    <fieldset disabled={this.disabled}>
                        <legend> 
                            <h4>Timeline Settings</h4>
                        </legend>
                    <div className="field">
                        <label htmlFor='o:timeline_toggle'>Show Timeline</label>
                            <div className='ui checkbox'>
                                <Field id="o:timeline_toggle" name="o:timeline_toggle"
                                component='input'
                                type="checkbox"
                                onChange={this.markUnsaved}
                                />
                            </div>
                    </div>
                    <div className='field'>
                        <label htmlFor='o:track_height'>Track Height</label>
                        <Field 	className="styleEditor_input"
                                id='o:track_height'
                                name='o:track_height'
                                component='input'
                                type='number'
                                data-enforce='float'
                                onChange={this.markUnsaved}/>
                    </div>
                    </fieldset>
                </Form>
            </div>
        )
    }
}

TimelineForm = reduxForm({form: 'exhibit',enableReinitialize:true})(TimelineForm);
const formSelector = formValueSelector('exhibit');

const mapStateToProps = state => ({
	state,
	mapCache: state.mapCache,
    initialValues: state.exhibitShow.exhibit?state.exhibitShow.exhibit:{ ...defaultValues }
});

const mapDispatchToProps = dispatch => bindActionCreators({
	change,
	dispatch
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TimelineForm);