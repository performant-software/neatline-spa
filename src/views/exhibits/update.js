import React from 'react';
import ExhibitForm from '../../components/exhibitForm';
import { updateExhibit } from '../../reducers/not_refactored/exhibitUpdate';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {strings} from '../../i18nLibrary';

const ExhibitUpdate = props => (
  <div className="ps_n3_exhibitFormContainer">
    <ExhibitForm exhibit={props.exhibit} onSubmit={props.submit} submitLabel={strings.save_exhibit} disabled={props.loading} />
    {props.errored &&
      <p>{strings.update_exhibit_error}</p>
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
