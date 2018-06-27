import React from 'react';
import RecordForm from '../../components/recordForm';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {createRecord} from '../../actions';

const RecordCreate = props => (<div>
	<RecordForm onSubmit={props.submit} submitLabel='Create' disabled={props.record.loading}/>
	<p>{props.record.error}</p>
</div>)

const mapPreviewoProps = state => ({record: state.record});

const mapDispatchToProps = dispatch => bindActionCreators({
	submit: createRecord
}, dispatch);

export default connect(mapPreviewoProps, mapDispatchToProps,)(RecordCreate);
