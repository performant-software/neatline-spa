import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CKEditor from 'ckeditor4-react';
import {bindActionCreators} from 'redux';
import {Field, reduxForm, change, formValueSelector} from 'redux-form'
import {connect} from 'react-redux';
import { Button, Form } from 'semantic-ui-react'


class NeatlineTextForm extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            data: '<p>React is really <em>nice</em>!</p>'
        };

        this.handleChange = this.handleChange.bind( this );
        this.onEditorChange = this.onEditorChange.bind( this );
    }

    onEditorChange( evt ) {
        this.setState( {
            data: evt.editor.getData()
        } );
    }

    handleChange( changeEvent ) {
        this.setState( {
            data: changeEvent.target.value
        } );
    }

    render() {
        return (
            <div className="ps_n3_exhibitFormContainer">
				<Form onSubmit={this.handleSubmit}>
					<fieldset disabled={this.disabled}>
					<legend>
						<h4>Neatline Text Settings</h4>
					</legend>
                    <div className="field">
                        <label htmlFor='o:text_toggle'>Show Exhibit Narrative</label>
                            <div className='ui checkbox'>
                                <Field id="o:text_toggle" name="o:text_toggle"
                                component='input'
                                type="checkbox"
                                />
                            </div>
                    </div>
                    <div className='field'>
							<label htmlFor='o:narrative'>Narrative</label>
							<div className='ui input'>
                            <CKEditor
                    data={this.state.data}
                    onChange={this.onEditorChange} />
                            </div>
                            </div>
                
               </fieldset>
               </Form>
                <EditorPreview data={this.state.data} />
               
            </div>
        );
    }
}

class EditorPreview extends Component {
    render() {
        return (
            <div className="editor-preview">
                <h2>Rendered content</h2>
                <div dangerouslySetInnerHTML={ { __html: this.props.data } }></div>
            </div>
        );
    }
}

EditorPreview.defaultProps = {
    data: ''
};

EditorPreview.propTypes = {
    data: PropTypes.string
};

NeatlineTextForm = reduxForm({form: 'exhibit',enableReinitialize:true})(NeatlineTextForm);
const formSelector = formValueSelector('exhibit');

const mapStateToProps = state => ({
	state,
	mapCache: state.mapCache,
    // initialValues: state.exhibitShow.exhibit?state.exhibitShow.exhibit:{ ...defaultValues }
});

const mapDispatchToProps = dispatch => bindActionCreators({
	change,
	dispatch
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(NeatlineTextForm);