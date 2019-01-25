import React from 'react';
import RecordForm from '../../components/RecordForm';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {createRecord} from '../../actions';
import {strings} from '../../i18nLibrary';
import { Breadcrumb } from 'semantic-ui-react';


const RecordCreate = props => (
	<div>
		<Breadcrumb>
			<Breadcrumb.Section onClick={() => {props.toggleRecords(true); props.deselect()} }>Records</Breadcrumb.Section>
			<Breadcrumb.Divider icon='right angle' />
			<Breadcrumb.Section active>New Record</Breadcrumb.Section>
		</Breadcrumb>
		<RecordForm onSubmit={props.submit}
					submitLabel={strings.create}
					disabled={props.record.loading}/>
		<p>{props.record.error}</p>
	</div>
)

const mapStateToProps = state => ({record: state.record});

const mapDispatchToProps = dispatch => bindActionCreators({
	submit: createRecord
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps,)(RecordCreate);
