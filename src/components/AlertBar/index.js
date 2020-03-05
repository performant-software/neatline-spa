import React from 'react';

class AlertBar extends React.Component {
	render() {
		return (
			<div id="neatline-alert" className={this.props.isVisible?"ps_n3_mapStatus_warning": "ps_n3_mapStatus_warning ps_n3_hidden"}>
				{this.props.message}
			</div>
		);
	}
}

export default (AlertBar);
