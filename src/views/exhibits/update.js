import React from 'react';
import ExhibitForm from '../../components/exhibitForm';
import { updateExhibit } from '../../modules/exhibitUpdate';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const ExhibitUpdate = props => (
  <div>
    <ExhibitForm exhibit={props.exhibit} onSubmit={props.submit} submitLabel='Save' disabled={props.loading} />
    {props.errored &&
      <p>Error: failed to update exhibit</p>
    }
  </div>
)

const mapStateToProps = state => ({
  loading: state.exhibitUpdate.loading,
  errored: state.exhibitUpdate.errored
});

const mapDispatchToProps = dispatch => bindActionCreators({
  submit: updateExhibit
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExhibitUpdate);
