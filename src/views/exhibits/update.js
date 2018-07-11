import React from 'react';
import ExhibitForm from '../../components/exhibitForm';
import { updateExhibit } from '../../reducers/not_refactored/exhibitUpdate';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const ExhibitUpdate = props => (
  <div className="ps_n3_exhibitFormContainer">
    <ExhibitForm exhibit={props.exhibit} onSubmit={props.submit} submitLabel='Save Exhibit' disabled={props.loading} />
    {props.errored &&
      <p>Error: failed to update exhibit</p>
    }
  </div>
)

const mapPreviewoProps = state => ({
  loading: state.exhibitUpdate.loading,
  errored: state.exhibitUpdate.errored
});

const mapDispatchToProps = dispatch => bindActionCreators({
  submit: updateExhibit
}, dispatch);

export default connect(
  mapPreviewoProps,
  mapDispatchToProps,
)(ExhibitUpdate);
