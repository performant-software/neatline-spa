import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CKEditor from 'ckeditor4-react';
import {bindActionCreators} from 'redux';
import {Field, reduxForm, change, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import {Form} from 'semantic-ui-react';


class NeatlineTextForm extends Component {
    constructor( props ) {
        super( props );
        this.exhibit = props.exhibit;
		this.handleSubmit = props.handleSubmit;
		this.submitLabel = props.submitLabel;
        this.disabled = props.disabled;
        
        this.state = {
            data: props.initialValues['o:narrative']
        };

        this.onEditorChange = this.onEditorChange.bind( this );
    }


    onEditorChange( evt ) {
        this.setState( {
            data: evt.editor.getData()
        } );
    }

    renderEditor({input}) {
		return (
		  <CKEditor
            data={input.value}
			onChange={(event) => {
                return console.log(event.editor.getData());
                // input.onChange(event.editor.getData());
                // console.log(event.editor.getData());
			  }
			}
		  />
		)
	}

    render() {
        console.log(this.state.data)
        // console.log(this.props.state.exhibitShow.exhibit['o:narrative'])
        return (
            <div className="ps_n3_exhibitFormContainer">
				<Form onSubmit={this.handleSubmit}>
					<fieldset disabled={this.disabled}>
					<legend>
						<h4>NeatlineText Settings</h4>
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
                        <Field 
                                id='o:narrative'
                                name='o:narrative'
                                component={this.renderEditor}
                                // onChange={this.markUnsaved}
                            />
                        </div>
                    </div>
                    {this.exhibit && this.exhibit['o:id'] &&
							<Field name='o:id'
								component='input'
								type='hidden' />
						}
                
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

NeatlineTextForm = reduxForm({form: 'exhibit-text',enableReinitialize:true})(NeatlineTextForm);
const formSelector = formValueSelector('exhibit-text');

const mapStateToProps = state => ({
	state,
	mapCache: state.mapCache,
    initialValues: state.exhibitShow.exhibit
        ? state.exhibitShow.exhibit
        : {
			'o:narrative': {
				'o:narrative': state.exhibitShow.exhibit['o:narrative']
			}
		}
});

const mapDispatchToProps = dispatch => bindActionCreators({
	change,
	dispatch
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(NeatlineTextForm);

