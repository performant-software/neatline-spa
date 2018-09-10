import React from 'react';
import {Link} from 'react-router-dom';
import {selectRecord} from '../../reducers/not_refactored/exhibitShow';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {strings} from '../../i18nLibrary';

const Records = props => (<div>
	<Link 	className="ps_n3_button"
			to={`${props.exhibitShowURL}/edit/new`}
			onClick={()=>{document.dispatchEvent(new Event("newRecordLoaded"));}}>
			{strings.new_record}
	</Link>
	<ul>
		{
			props.records.map(record => (
				<li key={'record-' + record['o:id']} style={{
						fontWeight: record === props.selectedRecord? 'bold': 'normal'
					}}>
					<Link 	onClick={()=>{document.dispatchEvent(new Event("newRecordLoaded"));}}
							to={`${props.exhibitShowURL}/edit/${record['o:id']}`}>
						{record['o:title'] === null?"UNTITLED":record['o:title']}
					</Link>
				</li>
			))
		}
	</ul>
</div>)


const mapStateToProps = state => ({records: state.exhibitShow.records, selectedRecord: state.exhibitShow.selectedRecord});

const mapDispatchToProps = dispatch => bindActionCreators({
	selectRecord
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Records);
