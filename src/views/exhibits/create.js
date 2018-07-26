import React from 'react';
import { Link } from 'react-router-dom';
import ExhibitForm from '../../components/ExhibitForm';
import { createExhibit } from '../../reducers/not_refactored/exhibitCreate';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { strings } from '../../i18nLibrary';

const ExhibitCreate = props => (
  <div className="ps_n3_exhibitFormContainer">
    <h3><Link to={`${window.baseRoute}/`}>Neatline</Link> | {strings.createExhibit}</h3>
    <ExhibitForm onSubmit={props.submit} submitLabel={strings.create_exhibit} disabled={props.loading} />
    {props.errored &&
      <p>{strings.create_exhibit_error}</p>
    }
  </div>
)

const mapStateToProps = state => ({
  newExhibit: state.exhibitCreate.newExhibit,
  loading: state.exhibitCreate.loading,
  errored: state.exhibitCreate.errored
});

const mapDispatchToProps = dispatch => bindActionCreators({
  submit: createExhibit
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExhibitCreate);
