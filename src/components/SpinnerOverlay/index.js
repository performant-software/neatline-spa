import React, {Component} from 'react';


class SpinnerOverlay extends Component {
	render() {
		return (
			<div id="spinner_container" className={this.props.isVisible?"spinner_container":"spinner_container hidden"}>
				<div className={this.props.error?"hidden":"spinner"}>
					<div className="bounce1"></div>
					<div className="bounce2"></div>
					<div className="bounce3"></div>
				</div>
			</div>
		);
	}
}

export default SpinnerOverlay;
