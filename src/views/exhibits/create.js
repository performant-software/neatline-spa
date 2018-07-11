import React from 'react';
import { Link } from 'react-router-dom';
import ExhibitForm from '../../components/exhibitForm';
import { createExhibit } from '../../reducers/not_refactored/exhibitCreate';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const ExhibitCreate = props => (
  <div className="ps_n3_exhibitFormContainer">
    <h3><Link to={`${window.baseRoute}/`}>Neatline</Link> | Create an Exhibit</h3>
    <ExhibitForm onSubmit={props.submit} submitLabel='Create exhibit' disabled={props.loading} />
    {props.errored &&
      <p>Error: failed to create exhibit</p>
    }
  </div>
)

const mapPreviewoProps = state => ({
  newExhibit: state.exhibitCreate.newExhibit,
  loading: state.exhibitCreate.loading,
  errored: state.exhibitCreate.errored
});

const mapDispatchToProps = dispatch => bindActionCreators({
  submit: createExhibit
}, dispatch);

export default connect(
  mapPreviewoProps,
  mapDispatchToProps,
)(ExhibitCreate);
