import React, { Component } from 'react';
import ExhibitForm from '../../components/ExhibitForm';
import MapForm from '../../components/ExhibitForm/MapForm';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {strings} from '../../i18nLibrary';
import { Tab } from 'semantic-ui-react';


class ExhibitUpdate extends Component {
	
	render() {
		const props = this.props;
		const panes = [
			{menuItem: 'Settings', render: () => 
				<Tab.Pane attached={false}>
					<ExhibitForm exhibit={props.exhibit}
						submitLabel={strings.save_exhibit}
						disabled={props.loading} />
					{props.errored &&
						<p>{strings.update_exhibit_error}</p>
					}
				</Tab.Pane>
			},
			{menuItem: 'Styles', render: () => 
				<Tab.Pane attached={false}>
					<MapForm exhibit={props.exhibit}
						submitLabel={strings.save_exhibit}
						disabled={props.loading} />
					{props.errored &&
						<p>{strings.update_exhibit_error}</p>
					}
				</Tab.Pane>
			},
			{menuItem: 'Plugin Settings', render: () => 
				<Tab.Pane attached={false}>
						plugins
				</Tab.Pane>
			},
		]
		return (
			<div>
				<Tab menu={{ secondary: true, pointing: true }} panes={panes} />
			</div>
		)
	}
}

const mapStateToProps = state => ({
  loading: state.exhibits.exhibit.loading,
  errored: state.exhibits.exhibit.errored
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExhibitUpdate);
