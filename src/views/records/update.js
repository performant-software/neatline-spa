import React, { Component } from 'react';
import RecordForm from '../../components/recordForm';
import { updateRecord } from '../../modules/recordUpdate';
import { deleteRecord } from '../../modules/recordDelete';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class RecordUpdate extends Component {
  render() {
    const { record, submit, loading, errored, deleteRecord } = this.props;

    if (record) {
      return (
        <div>
          <RecordForm onSubmit={submit} submitLabel='Save' disabled={loading} showDelete={true} handleDelete={() => deleteRecord(record)} />
          {errored &&
            <p>Error: failed to save record</p>
          }
        </div>
      );
    }
    else {
      return null;
    }
  }
}

const mapStateToProps = state => ({
  record: state.exhibitShow.editorRecord,
  loading: state.recordUpdate.loading,
  errored: state.recordCreate.errored
});

const mapDispatchToProps = dispatch => bindActionCreators({
  submit: updateRecord,
  deleteRecord
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordUpdate);
