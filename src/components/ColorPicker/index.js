//https://casesandberg.github.io/react-color/
import { SketchPicker } from 'react-color';
import React from 'react';

class ColorPicker extends React.Component {
	render() {
		return (
			<div id="ps_n3_colorPickerComponent" style={{top:this.props.top,left:'30px'}} className={this.props.isVisible?"ps_n3_colorPicker_picker":"ps_n3_colorPicker_picker ps_n3_hidden"}>
				<SketchPicker color={this.props.color} onChange={ this.props.handleChange }/>
			</div>
		);
	}
}

export default (ColorPicker);
