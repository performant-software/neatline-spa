import React, {Component} from 'react';
import RecordForm from '../../components/RecordForm';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {updateRecord, deleteRecord} from '../../actions';
import {strings} from '../../i18nLibrary';

class RecordUpdate extends Component {
	render() {
		const {record, submit, loading, deleteRecord, deselect, setShowRecords, setRecordEditorType} = this.props;
		if (record) {
			return (
			<div>
				<h4>{record['o:title']}</h4>
				<div className="breadcrumbs breadcrumbs-records">
					<a className="o-icon-left" onClick={() => { setShowRecords(true); setRecordEditorType(''); deselect(); }}>Back to Records</a>
				</div>
				<RecordForm onSubmit={submit} submitLabel={strings.save_record} disabled={loading} showDelete={true} handleDelete={() => {deleteRecord(record); setShowRecords(true); setRecordEditorType('')}}/>
				<p>{record.error}</p>
			</div>);
		} else {
			return null;
		}
	}
}

const mapStateToProps = state => ({
  record: state.exhibitShow.editorRecord,
  exhibit: state.exhibitShow.exhibit,
});

const mapDispatchToProps = dispatch => bindActionCreators({
	submit: updateRecord,
	deleteRecord
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RecordUpdate);
