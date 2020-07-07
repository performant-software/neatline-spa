import React from 'react';
import {Icon} from 'semantic-ui-react';

class AlertBar extends React.Component {
	render() {
		return (
			<div className={this.props.isVisible?"ps_n3_mapStatus_warning": "ps_n3_mapStatus_warning ps_n3_hidden"}>
				<Icon name="warning circle" />
				{this.props.message}
			</div>
		);
	}
}

export default (AlertBar);
