import React from 'react';
import ExhibitForm from '../../components/ExhibitForm';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {strings} from '../../i18nLibrary';

const ExhibitUpdate = props => (
  <div className="ps_n3_exhibitFormContainer">
    <ExhibitForm 	exhibit={props.exhibit}
					submitLabel={strings.save_exhibit}
					disabled={props.loading} />
    {props.errored &&
    	<p>{strings.update_exhibit_error}</p>
    }
  </div>
)

const mapStateToProps = state => ({
  loading: state.exhibits.exhibit.loading,
  errored: state.exhibits.exhibit.errored
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExhibitUpdate);
