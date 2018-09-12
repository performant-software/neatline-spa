import React, {Component} from 'react';


class LockOverlay extends Component {
	render() {
		return (
			<div id="lockOverlay_container" className={this.props.isVisible?"lockOverlay_container":"lockOverlay_container hidden"}>
				<div className={this.props.error?"hidden":"lockOverlay"}>
				</div>
			</div>

		);
	}
}

export default LockOverlay;
