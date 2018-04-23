import React from 'react';
import RecordForm from '../../components/recordForm';
import { createRecord } from '../../modules/recordCreate';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const RecordCreate = props => (
  <div>
    <RecordForm onSubmit={props.submit} submitLabel='Create' disabled={props.loading} />
    {props.errored &&
      <p>Error: failed to create record</p>
    }
  </div>
)

const mapStateToProps = state => ({
  newRecord: state.recordCreate.newRecord,
  loading: state.recordCreate.loading,
  errored: state.recordCreate.errored
});

const mapDispatchToProps = dispatch => bindActionCreators({
  submit: createRecord
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RecordCreate);
