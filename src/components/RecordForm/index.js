import React, {Component} from 'react';
import {Field, reduxForm, change} from 'redux-form';
import {Tabs, TabList, Tab, TabPanel} from 'react-tabs';
import {connect} from 'react-redux';
import {setUnsavedChanges, updateRecordCache, removeRecordFromCache} from '../../actions';
import ColorPicker from '../ColorPicker'
import DatePicker from '../DatePicker';
import {strings} from '../../i18nLibrary';
import {formatDate, parseDate} from 'react-day-picker/moment';
import 'react-day-picker/lib/style.css';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import moment from 'moment';
import {bindActionCreators} from 'redux';

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
		this.change = change;
		this.handleSubmit = props.handleSubmit;
		this.submitLabel = props.submitLabel;
		this.disabled = props.disabled;
		this.showDelete = props.showDelete;
		this.handleDelete = props.handleDelete;

		this.slider = {
			fieldName: '',
			value: ''
		};

		this.state = {
			strings,
			exhibitType: 'map',
			colorPickerVisible: false,
			colorPickerTop: 0,
			colorPickerCurrentColor: '000000',
			colorPickerCurrentField: '',
			colorPickerDefaultColor: '#000000',
			sliderValues: {}
		};
		this.cacheInitialized = false;
	}

	componentDidMount() {
		// For the sliders, setup initial values
		let initialSliderValues = {
			'o:fill_opacity': isNaN(parseFloat(this.props.initialValues['o:fill_opacity']))?0:parseFloat(this.props.initialValues['o:fill_opacity']),
			'o:stroke_opacity': isNaN(parseFloat(this.props.initialValues['o:stroke_opacity']))?0:parseFloat(this.props.initialValues['o:stroke_opacity']),
			'o:stroke_opacity_select': isNaN(parseFloat(this.props.initialValues['o:stroke_opacity_select']))?0:parseFloat(this.props.initialValues['o:stroke_opacity_select']),
			'o:stroke_width': isNaN(parseFloat(this.props.initialValues['o:stroke_width']))?0:parseFloat(this.props.initialValues['o:stroke_width']),
			'o:fill_opacity_select': isNaN(parseFloat(this.props.initialValues['o:fill_opacity_select']))?0:parseFloat(this.props.initialValues['o:fill_opacity_select'])
		}
		this.setState({sliderValues: initialSliderValues});
	}

	componentWillReceiveProps(nextprops) {

		// Update the cache if the record changed or not yet initialized
		if (!this.cacheInitialized || (nextprops.initialValues['o:id'] !== this.props.initialValues['o:id'])) {
			this.props.dispatch(updateRecordCache({setValues: nextprops.initialValues}));
			this.setState({recordID: nextprops.initialValues['o:id']});
			this.cacheInitialized = true;
		}
	}

	// Sets the unsaved changes flag
	// FIXME: this event handler is overloaded
	markUnsaved = (event) => {
		if (typeof event !== 'undefined') {
			// Converting moment into string for storage
			if (event.target.name.includes("date")) {
				event.target.value = moment(event.target.value).format('YYYY-MM-DD');
			}
			this.props.dispatch(updateRecordCache({
				setValues: {
					'o:id': this.props.initialValues['o:id'],
					[event.target.name]: event.target.value
				}
			}));
		}
		this.props.dispatch(setUnsavedChanges({hasUnsavedChanges: true}));
	}

	// Delete a record
	deleteRecord = () => {
		this.props.dispatch(removeRecordFromCache({recordID: this.props.initialValues['o:id']}));
		this.handleDelete();
	}

	scrollEvent = (event) =>{
		this.hideColorPicker(event);
	}

	render() {

		let thisRecord = this.props.mapCache.cache[this.props.initialValues['o:id']];
		let isSelected = (this.props.selectedRecord && this.state.recordID === this.props.selectedRecord["o:id"]);

		if(this.props.userSignedIn){
			return (
				<form className='ps_n3_exhibit-form' onSubmit={this.handleSubmit}>

				<ColorPicker color={this.state.colorPickerCurrentColor} isVisible={this.state.colorPickerVisible} top={this.state.colorPickerTop} handleChange={this.handleColorChange}/>
				<Tabs>
					<div className="ps_n3_buttonGroup">
						{
							this.showDelete && <div>
									<div 	className="ps_n3_button"
											onClick={this.deleteRecord}
											type='button'>Delete</div>
								</div>
						}
					</div>

					<TabList>
						<Tab>{strings.text}</Tab>
						<Tab>{strings.style}</Tab>
					</TabList>

					<div>
						<TabPanel>
							<div className="ps_n3_recordFormContainer"
								onScroll={this.scrollEvent}>
								<fieldset disabled={this.disabled} style={{
										border: 'none',
										padding: '0'
									}}>
									<div>
										<label 	htmlFor='o:title'>{strings.title}</label>
										<Field 	name='o:title'
												component='textarea'
												onChange={this.markUnsaved}/>
									</div>
									<div>
										<label 	htmlFor='o:slug'>{strings.slug}</label>
										<Field 	name='o:slug'
												component='input'
												type='text'
												onChange={this.markUnsaved}/>
									</div>
									<div>
										<label 	htmlFor='o:body'>{strings.body}</label>
										<Field 	name='o:body'
												component='textarea'
												onChange={this.markUnsaved}/>
									</div>
								</fieldset>
							</div>
						</TabPanel>
						<TabPanel>
							<div
								className="ps_n3_recordFormContainer"
								onScroll={this.scrollEvent}>
									{(typeof this.state.recordID === 'undefined') && <div>
										<i>save record before editing style</i>
									</div>
									}

									{(typeof this.state.recordID !== 'undefined') && <div>
										<fieldset id="scrollArea_stylePropertyPicker" className="ps_n3_recordFormContainer" disabled={this.disabled}>

											<div className={!isSelected ? "ps_n3_highlight":""}>
												<div className="ps_n3_optionHeader">{strings.colors}</div>
												<div>
													<label 	htmlFor='o:fill_color'>{strings.fill_color}</label>

													<div 	className="ps_n3_inputColorSwatch"
															data-initialcolor={this.props.initialValues['o:fill_color']}
															data-fieldname='o:fill_color'
															onClick={(event) => this.showColorPicker(event, 'o:fill_color')}
															style={{backgroundColor:(typeof thisRecord !== 'undefined')?thisRecord['o:fill_color']:'#0000FF'}}/>

													<Field 	className="styleEditor_input"
															name='o:fill_color'
															component='input'
															type='text'
															data-enforce='hex'
															onChange={this.inputEnforce}/>
												</div>

												<div>
													<label 	htmlFor='o:stroke_color'>{strings.stroke_color}</label>
													<div 	className="ps_n3_inputColorSwatch"
															data-fieldname='o:stroke_color'
															data-initialcolor={this.props.initialValues['o:stroke_color']}
															onClick={(event) => this.showColorPicker(event, 'o:stroke_color')}
															style={{backgroundColor:(typeof thisRecord !== 'undefined')?thisRecord['o:stroke_color']:'#0000FF'}}/>

													<Field 	className="styleEditor_input"
															name='o:stroke_color'
															component='input'
															type='text'
															data-enforce='hex'
															onChange={this.inputEnforce}/>
												</div>

												<div>
													<label htmlFor='o:fill_opacity'>{strings.fill_opacity}</label>
													<Slider value={this.state.sliderValues['o:fill_opacity']}
															min={0.1} max={1.0} step={0.01}
															orientation="horizontal"
															onChangeStart={() => this.slider_changeStart('o:fill_opacity')}
															onChange={this.slider_change}
															onChangeComplete={this.slider_changeComplete}/>

													<Field 	name='o:fill_opacity'
															component='input'
															type='hidden'/>
												</div>
												<div>
													<label htmlFor='o:stroke_opacity'>{strings.stroke_opacity}</label>
													<Slider value={this.state.sliderValues['o:stroke_opacity']}
															min={0.1} max={1.0} step={0.01}
															orientation="horizontal"
															onChangeStart={() => this.slider_changeStart('o:stroke_opacity')}
															onChange={this.slider_change}
															onChangeComplete={this.slider_changeComplete}/>

													<Field 	name='o:fill_opacity'
															component='input'
															type='hidden'/>
												</div>
											</div>
											<div className={isSelected
													? "ps_n3_highlight"
													: ""}>
												<div className="ps_n3_optionHeader">{strings.selected}</div>
												<div>
													<label htmlFor='o:fill_color_select'>{strings.selected_fill_color}</label>

													<div 	onClick={(event) => this.showColorPicker(event, 'o:fill_color_select')}
															className="ps_n3_inputColorSwatch"
															data-initialcolor={this.props.initialValues['o:fill_color_select']}
															data-fieldname='o:fill_color_select'
															style={{backgroundColor:(typeof thisRecord !== 'undefined')?thisRecord['o:fill_color_select']:'#0000FF'}}/>

													<Field 	className="styleEditor_input"
															name='o:fill_color_select'
															component='input'
															type='text'
															data-enforce='hex'
															onChange={this.inputEnforce}/>
												</div>
												<div>
													<label htmlFor='o:stroke_color_select'>{strings.selected_stroke_color}</label>
													<div 	onClick={(event) => this.showColorPicker(event, 'o:stroke_color_select')}
															className="ps_n3_inputColorSwatch"
															data-initialcolor={this.props.initialValues['o:stroke_color_select']}
															data-fieldname='o:stroke_color_select'
															style={{backgroundColor:(typeof thisRecord !== 'undefined')?thisRecord['o:stroke_color_select']:'#0000FF'}}/>

													<Field 	className="styleEditor_input"
															name='o:stroke_color_select'
															component='input'
															type='text'
															data-enforce='hex'
															onChange={this.inputEnforce}/>
												</div>
												<div>
													<label htmlFor='o:stroke_opacity_select'>{strings.selected_stroke_opacity}</label>

													<Slider value={this.state.sliderValues['o:stroke_opacity_select']}
															min={0.1} max={1.0} step={0.01}
															orientation="horizontal"
															onChangeStart={() => this.slider_changeStart('o:stroke_opacity_select')}
															onChange={this.slider_change}
															onChangeComplete={this.slider_changeComplete}/>

													<Field 	name='o:stroke_opacity_select'
															component='input'
															type='hidden'/>
												</div>
												<div>
													<label htmlFor='o:fill_opacity_select'>{strings.selected_fill_opacity}</label>
													<Slider value={this.state.sliderValues['o:fill_opacity_select']}
															min={0.1} max={1.0} step={0.01}
															orientation="horizontal"
															onChangeStart={() => this.slider_changeStart('o:fill_opacity_select')}
															onChange={this.slider_change}
															onChangeComplete={this.slider_changeComplete}/>
													<Field 	name='o:fill_opacity_select'
															component='input'
															type='hidden'/>
												</div>
											</div>

											<div className="ps_n3_optionHeader">{strings.dimensions}</div>
											<div>
												<label htmlFor='o:stroke_width'>{strings.stroke_width}</label>
												<Slider value={this.state.sliderValues['o:stroke_width']}
														min={0} max={20} step={0.01}
														orientation="horizontal"
														onChangeStart={() => this.slider_changeStart('o:stroke_width')}
														onChange={this.slider_change}
														onChangeComplete={this.slider_changeComplete}/>
												<Field 	name='o:stroke_width'
														component='hidden'/>
											</div>
											<div>
												<label htmlFor='o:point_radius'>{strings.point_radius}</label>
												<Field 	className="styleEditor_input"
														name='o:point_radius'
														component='input'
														type='number'
														data-enforce='float'
														onChange={this.inputEnforce}/>
											</div>
											<div>
												<label htmlFor='o:zindex'>{strings.z_index}</label>
												<Field 	className="styleEditor_input"
														name='o:zindex'
														component='input'
														type='number'
														data-enforce='float'
														onChange={this.inputEnforce}/>
											</div>
											<div>
												<label htmlFor='o:weight'>{strings.order_weight}</label>
												<Field 	className="styleEditor_input"
														name='o:weight'
														component='input'
														type='number'
														data-enforce='float'
														onChange={this.inputEnforce}/>
											</div>

											<div className="ps_n3_optionHeader">{strings.dates}</div>
											<div>
												<DatePicker fieldName='o:end_date'
															value={(typeof thisRecord !== 'undefined')? thisRecord['o:start_date']: ''}
															label={strings.start_date}
															formatDate={formatDate}
															parseDate={parseDate}
															onDayChange={this.markUnsaved}/>
											</div>
											<div>
												<DatePicker fieldName='o:end_date'
															value={(typeof thisRecord !== 'undefined')? thisRecord['o:end_date']: ''}
															label={strings.end_date}
															formatDate={formatDate}
															parseDate={parseDate}
															onDayChange={this.markUnsaved}/>
											</div>
											<div>
												<DatePicker fieldName='o:after_date' value={(typeof thisRecord !== 'undefined')? thisRecord['o:after_date']: ''}
															label={strings.after_date}
															formatDate={formatDate}
															parseDate={parseDate}
															onDayChange={this.markUnsaved}/>
											</div>
											<div>
												<DatePicker fieldName='o:before_date'
															value={(typeof thisRecord !== 'undefined')? thisRecord['o:before_date']: ''}
															label={strings.before_date}
															formatDate={formatDate}
															parseDate={parseDate}
															onDayChange={this.markUnsaved}/>
											</div>

											<div className="ps_n3_optionHeader">{strings.imagery}</div>
											<div>
												<label htmlFor='o:point_image'>{strings.point_image}</label>
												<Field 	className="styleEditor_input"
														name='o:point_image'
														component='input'
														type='text'
														onChange={this.markUnsaved}/>
											</div>
											<div>
												<label htmlFor='o:wms_address'>{strings.wms_address}</label>
												<Field 	className="styleEditor_input"
														name='o:wms_address'
														component='input'
														type='text'
														onChange={this.markUnsaved}/>
											</div>
											<div>
												<label htmlFor='o:wms_layers'>{strings.wms_layers}</label>
												<Field 	className="styleEditor_input"
														name='o:wms_layers'
														component='input'
														type='text'
														onChange={this.markUnsaved}/>
											</div>
											{/*
												Zoom/Visibility disabled for alpha
												Issue: https://github.com/performant-software/neatline-3/issues/30

												<div className="ps_n3_optionHeader">{strings.visibility}</div>
												<div>
													<label htmlFor='o:min_zoom'>{strings.min_zoom}</label>
													<Field className="styleEditor_input" name='o:min_zoom' component='input' type='number' onChange={this.markUnsaved}/>
												</div>
												<div>
													<label htmlFor='o:max_zoom'>{strings.max_zoom}</label>
													<Field className="styleEditor_input" name='o:max_zoom' component='input' type='number' onChange={this.markUnsaved}/>
												</div>
												<div>
													<label htmlFor='o:map_zoom'>{strings.default_zoom}</label>
													<Field className="styleEditor_input" name='o:map_zoom' component='input' type='number' onChange={this.markUnsaved}/>
												</div>

												<div>
													<label htmlFor='o:map_focus'>{strings.default_focus}</label>
													<Field className="styleEditor_input" name='o:map_focus' component='input' type='text' onChange={this.markUnsaved}/>
												</div>
											*/}
										</fieldset>
									</div>
							}
						</div>
						</TabPanel>
					</div>

				</Tabs>
				<Field className="styleEditor_input" name='o:coverage' component='input' type='hidden'/>
				<Field className="styleEditor_input" name='o:is_coverage' component='input' type='hidden'/>
				<Field className="styleEditor_input" name='o:exhibit_id' component='input' type='hidden'/>

			</form>)
		}else{
			return(<div>{thisRecord['o:body']}</div>);
		}
	}

	// FIXME: Factor out ColorPicker
	_colorPickerListener = (event) => {
		let targetElement = event.target;
		let el = document.getElementById('colorPickerComponent');
		// Walk the DOM
		do {
			// This is a click inside. Do nothing, just return.
			if (targetElement === el) {
				return;
			}
			targetElement = targetElement.parentNode;
		} while (targetElement);

		// this. is a click outside.
		if (this.state.colorPickerVisible) {
			this.hideColorPicker(event);
		};
	}

	colorPickerEventHandler = (enable) => {
		if (enable) {
			document.addEventListener("click", this._colorPickerListener);
		} else {
			document.removeEventListener("click", this._colorPickerListener);
		}
	}

	showColorPicker = (event, propertyToColor) => {
		let parentEl = document.getElementById("scrollArea_stylePropertyPicker");
		let top = (event.target.offsetTop - parentEl.scrollTop);
		top +=8;
		this.setState({colorPickerCurrentColor: event.target.dataset.initialcolor, colorPickerCurrentField: event.target.dataset.fieldname, colorPickerCurrentlyEditing: propertyToColor, colorPickerVisible: true, colorPickerTop: `${top}px`});

		this.colorPickerEventHandler(true);
	}

	hideColorPicker = (event) => {
		this.setState({colorPickerVisible: false});
		this.colorPickerEventHandler(false);

		// Update the form
		this.props.dispatch(this.change(this.props.form, this.state.colorPickerCurrentField, this.state.colorPickerCurrentColor));
	}

	handleColorChange = (color, event) => {

		let property = this.state.colorPickerCurrentlyEditing;
		let value = color.hex;

		this.setState({colorPickerCurrentColor: value, [property]: value});

		if (typeof property === 'undefined') {
			debugger
			console.error('Cannot update cache with undefined prop!:' + value);
		} else {
			this.props.dispatch(updateRecordCache({
				setValues: {
					'o:id': this.props.initialValues['o:id'],
					[property]: value
				}
			}));
			this.markUnsaved();
		}

	}

	// FIXME: Factor out Slider
	slider_changeStart = (fieldName) => {
		// Register the name of the field we're adjusting
		this.slider.fieldName = fieldName;
	}

	slider_change = (value) => {
		if (this.slider.fieldName.length > 0) {
			// Hold the changed value
			this.slider.value = value.toFixed(2);

			// Set the state (updates the UI)
			let updatedSliderValues = {
				...this.state.sliderValues,
				[this.slider.fieldName]: parseFloat(this.slider.value)
			}
			this.setState({sliderValues: updatedSliderValues});

			// Fake a blur event to update the value (updates the map)
			this.markUnsaved({
				target: {
					value: this.slider.value,
					name: this.slider.fieldName
				}
			});
		}
	}

	slider_changeComplete = (event) => {
		// Change the hidden form field
		this.props.dispatch(this.change(this.props.form, this.slider.fieldName, this.slider.value));

		// Flag the map needs saving
		this.markUnsaved({
			target: {
				value: this.slider.value,
				name: this.slider.fieldName
			}
		});

		this.slider = {
			fieldName: '',
			value: ''
		}
	}

	// FIXME: Factor out inputenforcer (NOTE: should probably remove)
	inputEnforce = (event) => {
		let enforcementType = event.target.dataset.enforce;
		let currentVal = event.target.value;
		let currentField = event.target.name;
		let forcedValue = null;
		switch (enforcementType) {

			case 'float':
				if (/[^.\d]/.test(currentVal)) {
					forcedValue = parseFloat(currentVal);
					forcedValue = isNaN(forcedValue)
						? ""
						: forcedValue.toString();
				};
				break;

			case 'normal':
				if (/[^.\d]/.test(currentVal)) {
					forcedValue = parseFloat(currentVal);
				} else {
					forcedValue = currentVal;
				}
				forcedValue = (forcedValue > 1)
					? 1
					: forcedValue;
				forcedValue = (forcedValue < 0)
					? 0
					: forcedValue;
				forcedValue = isNaN(forcedValue)
					? ""
					: forcedValue.toString();
				break;

			case 'hex':
				// If the input is 7 chars or over, or if it is at least 1 but doesn't start with #
				if ((currentVal.length >= 7) || (currentVal.length > 0 && (currentVal.substring(0, 1) !== '#'))) {

					// Check to see if it's a valid hex
					if (!/^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(currentVal)) {
						// Fixme... this detects but does not handle bad hex that matches
						// the format. For example #00X0000 is invalid but passes through
						if (currentVal.substring(0, 1) !== '#') {
							forcedValue = "#" + currentVal.substring(0, 6);
						} else {
							forcedValue = currentVal.substring(0, 7);
						}
					}
				}
				break;

			default:
				console.log("RecordForm inputEnforce: I don't know how to enforce: " + enforcementType);
		}
		if (forcedValue !== null) {
			// FIXME: time delay workaround because this doesn't get dispatched until next click
			setTimeout(() => {
				this.props.dispatch(this.change(this.props.form, currentField, forcedValue));
			}, 100);
		}
		this.markUnsaved();
	}

}

RecordForm = reduxForm({form: 'record', enableReinitialize: true})(RecordForm);
const mapStateToProps = state => ({
	record: state.record,
	userSignedIn: state.user.userSignedIn,
	mapCache: state.mapCache,
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

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RecordForm);
