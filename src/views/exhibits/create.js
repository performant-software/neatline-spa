import React from 'react';
import { Link } from 'react-router-dom';
import ExhibitForm from '../../components/exhibitForm';
import { createExhibit } from '../../modules/exhibitCreate';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const ExhibitCreate = props => (
  <div>
    <h3><Link to={`${window.baseRoute}/`}>Neatline</Link> | Create an Exhibit</h3>
    <ExhibitForm onSubmit={props.submit} submitLabel='Create exhibit' disabled={props.loading} />
    {props.errored &&
      <p>Error: failed to create exhibit</p>
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
