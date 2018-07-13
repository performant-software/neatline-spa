import React, {Component} from 'react';
import RecordForm from '../../components/RecordForm';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {updateRecord, deleteRecord} from '../../actions';
import {strings} from '../../i18nLibrary'

class RecordUpdate extends Component {
	render() {
		const {record, submit, loading, deleteRecord} = this.props;

		if (record) {
			return (
			<div>
				<RecordForm onSubmit={submit} submitLabel={strings.save_record} disabled={loading} showDelete={true} handleDelete={() => deleteRecord(record)}/>
				<p>{this.props.record.error}</p>
			</div>);
		} else {
			return null;
		}
	}
}

const mapStateToProps = state => ({
  record: state.exhibitShow.editorRecord
});

const mapDispatchToProps = dispatch => bindActionCreators({
	submit: updateRecord,
	deleteRecord
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RecordUpdate);
