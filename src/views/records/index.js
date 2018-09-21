import React from 'react';
import {Link} from 'react-router-dom';
import {selectRecord} from '../../actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {strings} from '../../i18nLibrary';

const Records = props => (
	<div>

	<Link 	className="ps_n3_button"
			to={`${props.exhibitShowURL}/edit/new`}>
			{strings.new_record}
	</Link>
	<ul>
		{props.records.map(record => (
				<li key={'record-' + record['o:id']} style={{
						fontWeight: record === props.selectedRecord? 'bold': 'normal'
					}}>
					<div onClick={()=>{props.selectRecord(record);}}>
						{record['o:title'] === null?"???":record['o:title']}
					</div>
				</li>
			))
		}
	</ul>
</div>)


const mapStateToProps = state => ({
	record:state.record,
	records: state.exhibitShow.records,
	selectedRecord: state.exhibitShow.selectedRecord
});

const mapDispatchToProps = dispatch => bindActionCreators({
	selectRecord,
	dispatch
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Records);
