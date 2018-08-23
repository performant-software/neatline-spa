import React from 'react';
import {Field} from 'redux-form';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from 'moment';

class DatePicker extends React.Component {
	render() {
		let thisValue=this.props.formatDate(this.props.value);
		if(!moment(this.props.value).isValid()){
			thisValue='';
		}
		return (
			<div>
				<label 	htmlFor={this.props.fieldName}>{this.props.label}</label>
				<Field 	name={this.props.fieldName}
						component='input'
						type='hidden'/>

				<DayPickerInput	className="styleEditor_input"
								formatDate={this.props.formatDate}
								parseDate={this.props.parseDate}
								value={thisValue}
								onDayChange={(value)=>{this.props.onDayChange({target:{value:value,name:this.props.fieldName}})}}/>
			</div>
		);
	}
}

export default (DatePicker);
