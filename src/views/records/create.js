import React, {Component} from 'react';
import RecordForm from '../../components/RecordForm';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {createRecord, selectRecord} from '../../actions';
import {strings} from '../../i18nLibrary';
// import { Breadcrumb } from 'semantic-ui-react';


class RecordCreate extends Component {

	render() {
		return (
			<div>
				{/* <Breadcrumb>
					<Breadcrumb.Section onClick={() => { this.props.setShowRecords(true); this.props.setRecordEditorType(''); this.props.deselect() }}>Records</Breadcrumb.Section>
					<Breadcrumb.Divider icon='right angle' />
					<Breadcrumb.Section active>New Record</Breadcrumb.Section>
				</Breadcrumb> */}
				<RecordForm onSubmit={this.props.submit}
					submitLabel={strings.create}
					disabled={this.props.record.loading}
				/>
				<p>{this.props.record.error}</p>
			</div>
		)
	}
}

const mapStateToProps = state => ({record: state.record});

const mapDispatchToProps = dispatch => bindActionCreators({
	submit: createRecord,
	selectRecord,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps,)(RecordCreate);
