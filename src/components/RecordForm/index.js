import React, {Component} from 'react';
import {Field, reduxForm, change} from 'redux-form';
import {Tabs, TabList, Tab, TabPanel} from 'react-tabs';
import {connect} from 'react-redux';
import {preview_update,preview_init,setUnsavedChanges} from '../../actions';
import ColorPicker from './colorPicker.js';
import {strings} from '../../i18nLibrary';



const defaultValues = {
	'o:fill_color': '#00aeff',
	'o:fill_color_select': '#00aeff',
	'o:stroke_color': '#000000',
	'o:stroke_color_select': '#000000',
	'o:fill_opacity': 0.3,
	'o:fill_opacity_select': 0.4,
	'o:stroke_opacity': 0.9,
	'o:stroke_opacity_select': 1,
	'o:stroke_width': 2,
	'o:point_radius': 10
};


class RecordForm extends Component {

	constructor(props) {
		super(props);
		// Mapping to this
		this.inputEnforce = this.inputEnforce.bind(this);
		this.change = change;
		this.handleSubmit = props.handleSubmit;
		this.submitLabel = props.submitLabel;
		this.disabled = props.disabled;
		this.showDelete = props.showDelete;
		this.handleDelete = props.handleDelete;
		this.preview_init=preview_init.bind(this);
		this.preview_update = preview_update.bind(this);
		this.state={
			exhibitType:'map',
			colorPickerVisible:false,
			colorPickerTop:0,
			colorPickerCurrentColor:'000000',
			colorPickerCurrentField:'',
			colorPickerDefaultColor:'#000000',
			strings
		};
		this.previewInitialized=false;
	}

	// Sets the unsaved changes flag
	markUnsaved = () => {
		this.props.dispatch(
			setUnsavedChanges({hasUnsavedChanges:true})
		);
	}

	// After mount
	componentWillReceiveProps(nextprops){
		// Populate the live preview object with the form fields if the record changed
		if(!this.previewInitialized || nextprops.initialValues['o:id'] !== this.props.initialValues['o:id']){
			this.props.dispatch(this.preview_init(nextprops.initialValues));
			this.setState({
				recordID:nextprops.initialValues['o:id'],
				fillColor:nextprops.initialValues['o:fill_color'],
				fillColor_selected:nextprops.initialValues['o:fill_color_select'],
				strokeColor:nextprops.initialValues['o:stroke_color'],
				strokeColor_selected:nextprops.initialValues['o:stroke_color_select']
			});
			this.previewInitialized=true;
		}
	}

	// Color picker
	// Fixme: Factor out
	_colorPickerListener = (event) => {
		let targetElement = event.target;
		let el = document.getElementById('colorPickerComponent');
		// Walk the DOM
		do {
			// This is a click inside. Do nothing, just return.
			if (targetElement === el) {return;}
			targetElement = targetElement.parentNode;
		} while (targetElement);

		// This is a click outside.
		if(this.state.colorPickerVisible){
			this.hideColorPicker(event);
		};
	}

	colorPickerEventHandler(enable){
		if(enable){
			// Handler to close colorpciker
			document.addEventListener("click", this._colorPickerListener);
		}else{
			document.removeEventListener("click", this._colorPickerListener);
		}
	}

	showColorPicker = (event,propertyToColor) => {
		let parentEl = document.getElementById("scrollArea_stylePropertyPicker");
		let top = (event.target.offsetTop-parentEl.scrollTop);
		this.setState({	colorPickerCurrentColor:event.target.dataset.initialcolor,
						colorPickerCurrentField:event.target.dataset.fieldname,
						colorPickerCurrentlyEditing:propertyToColor,
						colorPickerVisible:true,
						colorPickerTop:`${top}px`});

		this.colorPickerEventHandler(true);
	}

	// Dismiss the colorpicker
	hideColorPicker = (event) =>{
		this.setState({colorPickerVisible:false});
		this.colorPickerEventHandler(false);

		// Update the form
		this.props.dispatch(this.change(this.props.form,this.state.colorPickerCurrentField, this.state.colorPickerCurrentColor));
	}

	// Handle ongoing colorpicker changes
	handleColorChange = (color,event) =>{
		this.setState({colorPickerCurrentColor:color.hex});
		this.setState({[this.state.colorPickerCurrentlyEditing]:color.hex});

		// Update the preview
		this.props.dispatch(
			this.preview_update({
				recordID:this.state.recordID,
				property: this.state.colorPickerCurrentlyEditing,
			 	value: color.hex
			})
		);
	}

	// When the field blurs, write the value to the appropriate field
	onFieldBlur = (event) =>{
		let value = event.target.value;
		let currentField = event.target.name;
		let property = '';
		switch (currentField) {
			case 'o:fill_color':
				property = 'fillColor';
				break;

			case 'o:fill_color_select':
				property = 'fillColor_selected';
				break;

			case 'o:stroke_color':
				property = 'stroke_color';
				break;

			case 'o:stroke_color_select':
				property = 'stroke_color_selected';
				break;

			case 'o:fill_opacity':
				property = 'fill_opacity';
				break;

			case 'o:fill_opacity_select':
				property = 'fill_opacity_selected';
				break;

			case 'o:stroke_opacity':
				property = 'stroke_opacity';
				break;

			case 'o:stroke_opacity_select':
				property = 'stroke_opacity_selected';
				break;

			case 'o:fill_color_selected':
				property = 'fillColor_selected';
				break;

			case 'o:fill_opacity_selected':
				property = 'fill_opacity_selected';
				break;

			case 'o:stroke_opacity_selected':
				property = 'stroke_opacity_selected';
				break;

			case 'o:stroke_width':
				property = 'stroke_weight';
				break;


			default:
				console.log("UpdatePreview: I don't know how to update "+currentField);
		}

		// Dispatch update
		if(property.length > 0){
			this.props.dispatch(
				this.preview_update({recordID:this.state.recordID, property:property, value:value})
			);
		}
	}


	// Input enforcer
	// Fixme: factor out
	inputEnforce(event){
		let enforcementType = event.target.dataset.enforce;
		let currentVal = event.target.value;
		let currentField = event.target.name;
		let forcedValue=null;
		switch (enforcementType) {

			case 'float':
				if (/[^.\d]/.test(currentVal)) {
					forcedValue = parseFloat(currentVal);
					forcedValue= isNaN(forcedValue)?"":forcedValue.toString();
				};
				break;

			case 'normal':
					if (/[^.\d]/.test(currentVal)) {
						forcedValue = parseFloat(currentVal);
					}else{
						forcedValue = currentVal;
					}
					forcedValue = (forcedValue>1)?1:forcedValue;
					forcedValue = (forcedValue<0)?0:forcedValue;
					forcedValue= isNaN(forcedValue)?"":forcedValue.toString();
					break;

			case 'hex':
				// If the input is 7 chars or over, or if it is at least 1 but doesn't start with #
				if( (currentVal.length >= 7) ||
					(currentVal.length > 0 && (currentVal.substring(0,1)!=='#')) ){

					// Check to see if it's a valid hex
					if(! /^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(currentVal)){
						// Fixme... this detects but does not handle bad hex that matches
						// the format. For example #00X0000 is invalid but passes through
						if(currentVal.substring(0,1)!=='#'){
							forcedValue="#"+currentVal.substring(0,6);
						}else{
							forcedValue=currentVal.substring(0,7);
						}
					}
				}
				break;

			default:
				console.log("RecordForm inputEnforce: I don't know how to enforce: " +enforcementType);
		}
		if(forcedValue !== null){
			// FIXME: time delay workaround because this doesn't get dispatched until next click
			setTimeout(()=> { this.props.dispatch(this.change(this.props.form,currentField,forcedValue)); }, 100);

		}
		this.markUnsaved();
	}

	render(){
		let isSelected = (this.props.selectedRecord && this.state.recordID === this.props.selectedRecord["o:id"]);


		return (
			<form className='ps_n3_exhibit-form' onSubmit={this.handleSubmit}>

			<ColorPicker color={this.state.colorPickerCurrentColor}
						 isVisible={this.state.colorPickerVisible}
						 top={this.state.colorPickerTop}
					 	 handleChange={this.handleColorChange}/>
			<Tabs>

				{/* Form buttons */}
				<div className="ps_n3_buttonGroup">
					<button className="ps_n3_button" type='submit'>{this.submitLabel}</button>
					{this.showDelete && <button className="ps_n3_button" onClick={this.handleDelete} type='button'>Delete</button>}
				</div>

				<TabList>
					<Tab>{strings.text}</Tab>
					<Tab>{strings.style}</Tab>
				</TabList>

				<div>
					<TabPanel>
						<div id="scrollArea_stylePropertyPicker" className="ps_n3_recordFormContainer">
							<fieldset disabled={this.disabled} style={{
									border: 'none',
									padding: '0'
								}}>
								<div>
									<label htmlFor='o:title'>{strings.title}</label>
									<Field 	name='o:title'
											component='textarea'
											onChange={this.markUnsaved}/>
								</div>
								<div>
									<label htmlFor='o:slug'>{strings.slug}</label>
									<Field 	name='o:slug'
											component='input'
											type='text'
											onChange={this.markUnsaved}/>
								</div>
								<div>
									<label htmlFor='o:body'>{strings.body}</label>
									<Field 	name='o:body'
											component='textarea'
											onChange={this.markUnsaved}/>
								</div>
							</fieldset>
						</div>
					</TabPanel>
					<TabPanel>
						<div>
							<fieldset id="scrollArea_stylePropertyPicker" className="ps_n3_recordFormContainer" disabled={this.disabled}>

								<div className={!isSelected?"ps_n3_highlight":""}>
									<div className="ps_n3_optionHeader">{strings.colors}</div>
									<div>
										<label 	htmlFor='o:fill_color'>{strings.fill_color}</label>

										<div 	className="ps_n3_inputColorSwatch"
												data-initialcolor={this.state.fillColor}
												data-fieldname='o:fill_color'
												onClick={(event)=>this.showColorPicker(event,'fillColor')}
												style={{backgroundColor:this.state.fillColor}}/>

										<Field 	className="styleEditor_input"
												name='o:fill_color'
												component='input'
												type='text'
												data-enforce='hex'
												onBlur={this.onFieldBlur}
												onChange={this.inputEnforce}/>
									</div>

									<div>
										<label 	htmlFor='o:stroke_color'>{strings.stroke_color}</label>
										<div 	className="ps_n3_inputColorSwatch"
												data-fieldname='o:stroke_color'
												data-initialcolor={this.state.strokeColor}
												onClick={(event)=>this.showColorPicker(event,'strokeColor')}
												style={{backgroundColor:this.state.strokeColor}}/>

										<Field 	className="styleEditor_input"
												name='o:stroke_color'
												component='input'
												type='text'
												data-enforce='hex'
												onBlur={this.onFieldBlur}
												onChange={this.inputEnforce}/>
									</div>

									<div>
										<label 	htmlFor='o:fill_opacity'>{strings.fill_opacity}</label>
										<Field 	className="styleEditor_input"
												name='o:fill_opacity'
												component='input'
												type='text'
												data-enforce='normal'
												onBlur={this.onFieldBlur}
												onChange={this.inputEnforce}/>
									</div>
									<div>
										<label 	htmlFor='o:stroke_opacity'>{strings.stroke_opacity}</label>
										<Field 	className="styleEditor_input"
												name='o:stroke_opacity'
												component='input'
												type='text'
												data-enforce='normal'
												onBlur={this.onFieldBlur}
												onChange={this.inputEnforce}/>
									</div>
								</div>
								<div className={isSelected?"ps_n3_highlight":""}>
									<div className="ps_n3_optionHeader">{strings.selected}</div>
									<div>
										<label 	htmlFor='o:fill_color_select'>{strings.selected_fill_color}</label>

										<div 	onClick={(event)=>this.showColorPicker(event,'fillColor_selected')}
												className="ps_n3_inputColorSwatch"
												data-initialcolor={this.state.fillColor_selected}
												data-fieldname='o:fill_color_select'
												style={{backgroundColor:this.state.fillColor_selected}}></div>

										<Field 	className="styleEditor_input"
												name='o:fill_color_select'
												component='input'
												type='text'
												data-enforce='hex'
												onBlur={this.onFieldBlur}
												onChange={this.inputEnforce}/>
									</div>
									<div>
										<label 	htmlFor='o:stroke_color_select'>{strings.selected_stroke_color}</label>
										<div 	onClick={(event)=>this.showColorPicker(event,'strokeColor_selected')}
												className="ps_n3_inputColorSwatch"
												data-initialcolor={this.state.strokeColor_selected}
												data-fieldname='o:stroke_color_select'
												style={{backgroundColor:this.state.strokeColor_selected}}></div>
										<Field 	className="styleEditor_input"
												name='o:stroke_color_select'
												component='input'
												type='text'
												data-enforce='hex'
												onBlur={this.onFieldBlur}
												onChange={this.inputEnforce}/>
									</div>
									<div>
										<label 	htmlFor='o:stroke_opacity_selected'>{strings.selected_stroke_opacity}</label>
										<Field 	className="styleEditor_input"
												name='o:stroke_opacity_selected'
												component='input'
												type='text'
												data-enforce='normal'
												onBlur={this.onFieldBlur}
												onChange={this.inputEnforce}/>
									</div>
									<div>
										<label 	htmlFor='o:fill_opacity_select'>{strings.selected_fill_opacity}</label>
										<Field 	className="styleEditor_input"
												name='o:fill_opacity_selected'
												component='input'
												type='text'
												data-enforce='normal'
												onBlur={this.onFieldBlur}
												onChange={this.inputEnforce}/>
									</div>
								</div>

								<div className="ps_n3_optionHeader">{strings.dimensions}</div>
								<div>
									<label 	htmlFor='o:stroke_width'>{strings.stroke_width}</label>
									<Field 	className="styleEditor_input"
											name='o:stroke_width'
											component='input'
											type='number'
											data-enforce='float'
											onChange={this.inputEnforce}
											onBlur={this.onFieldBlur}/>
								</div>
								<div>
									<label 	htmlFor='o:point_radius'>{strings.point_radius}</label>
									<Field 	className="styleEditor_input"
											name='o:point_radius'
											component='input'
											type='number'
											data-enforce='float'
											onChange={this.inputEnforce}/>
								</div>
								<div>
									<label 	htmlFor='o:zindex'>{strings.z_index}</label>
									<Field 	className="styleEditor_input"
											name='o:zindex'
											component='input'
											type='number'
											data-enforce='float'
											onChange={this.inputEnforce}/>
								</div>
								<div>
									<label	htmlFor='o:weight'>{strings.order_weight}</label>
									<Field 	className="styleEditor_input"
											name='o:weight'
											component='input'
											type='number'
											data-enforce='float'
											onChange={this.inputEnforce}/>
								</div>

								<div className="ps_n3_optionHeader">{strings.dates}</div>
								<div>
									<label 	htmlFor='o:start_date'>{strings.start_date}</label>
									<Field 	className="styleEditor_input"
											name='o:start_date'
											component='input'
											type='text'
											onChange={this.markUnsaved}/>
								</div>
								<div>
									<label 	htmlFor='o:end_date'>{strings.end_date}</label>
									<Field 	className="styleEditor_input"
											name='o:end_date'
											component='input'
											type='text'
											onChange={this.markUnsaved}/>
								</div>
								<div>
									<label 	htmlFor='o:after_date'>{strings.after_date}</label>
									<Field 	className="styleEditor_input"
											name='o:after_date'
											component='input'
											type='text'/>
								</div>
								<div>
									<label 	htmlFor='o:before_date'>{strings.before_date}</label>
									<Field 	className="styleEditor_input"
											name='o:before_date'
											component='input'
											type='text'
											onChange={this.markUnsaved}/>
								</div>

								<div className="ps_n3_optionHeader">{strings.imagery}</div>
								<div>
									<label 	htmlFor='o:point_image'>{strings.point_image}</label>
									<Field 	className="styleEditor_input"
											name='o:point_image'
											component='input'
											type='text'
											onChange={this.markUnsaved}/>
								</div>
								<div>
									<label 	htmlFor='o:wms_address'>{strings.wms_address}</label>
									<Field 	className="styleEditor_input"
											name='o:wms_address'
											component='input'
											type='text'
											onChange={this.markUnsaved}/>
								</div>
								<div>
									<label 	htmlFor='o:wms_layers'>{strings.wms_layers}</label>
									<Field 	className="styleEditor_input"
											name='o:wms_layers'
											component='input'
											type='text'
											onChange={this.markUnsaved}/>
								</div>

								<div className="ps_n3_optionHeader">{strings.visibility}</div>
								<div>
									<label 	htmlFor='o:min_zoom'>{strings.min_zoom}</label>
									<Field 	className="styleEditor_input"
											name='o:min_zoom'
											component='input'
											type='number'
											onChange={this.markUnsaved}/>
								</div>
								<div>
									<label 	htmlFor='o:max_zoom'>{strings.max_zoom}</label>
									<Field 	className="styleEditor_input"
											name='o:max_zoom'
											component='input'
											type='number'
											onChange={this.markUnsaved}/>
								</div>
								<div>
									<label 	htmlFor='o:map_zoom'>{strings.default_zoom}</label>
									<Field 	className="styleEditor_input"
											name='o:map_zoom'
											component='input'
											type='number'
											onChange={this.markUnsaved}/>
								</div>

								<div>
									<label 	htmlFor='o:map_focus'>{strings.default_focus}</label>
									<Field 	className="styleEditor_input"
											name='o:map_focus'
											component='input'
											type='text'
											onChange={this.markUnsaved}/>
								</div>
							</fieldset>
						</div>
					</TabPanel>


				</div>

			</Tabs>
			<Field className="styleEditor_input" name='o:coverage' component='input' type='hidden'/>
			<Field className="styleEditor_input" name='o:is_coverage' component='input' type='hidden'/>
			<Field className="styleEditor_input" name='o:exhibit_id' component='input' type='hidden'/>

		</form>
		)
	}
}

RecordForm = reduxForm({form: 'record'})(RecordForm);
const mapStateToProps = state => ({
	mapPreview: state.mapPreview,
	selectedRecord: state.exhibitShow.selectedRecord,
	initialValues: state.exhibitShow.editorRecord
		? state.exhibitShow.editorRecord
		: {
			...defaultValues,
			'o:exhibit': {
				'o:id': state.exhibitShow.exhibit['o:id']
			}
		}
});


export default connect(mapStateToProps, null)(RecordForm);
