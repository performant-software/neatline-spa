import React, { Component } from 'react';
import { selectRecord, filterRecords, removeRecordFromCache, deleteRecord} from '../../actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { strings } from '../../i18nLibrary';
import { div, Button, Table, Search, Card } from 'semantic-ui-react';
import _ from 'lodash';

class Records extends Component {
	constructor(props){
		super(props)
		this.state = { activeCard: null };
	}
	componentWillMount() {
		this.resetSearch();
	}
	resetSearch = () => this.setState({ results: this.props.filteredRecords, column: null, direction: null, 'searchTerm': '' });

	searchChange = (e, d) => {
		if (d.value.length < 1) return this.resetSearch()
		this.setState({'searchTerm': d.value})
	}
	handleSort = clickedColumn => () => {
		const { column, results, direction } = this.state

		if (column !== clickedColumn) {
			this.setState({
				column: clickedColumn,
				results: _.sortBy(results, [clickedColumn]),
				direction: 'ascending',
			})
			return
		}

		this.setState({
			results: results.reverse(),
			direction: direction === 'ascending' ? 'descending' : 'ascending',
		})
	}
	mouseClick = (e, d) => {
		if (e.keyCode === 13) {
			let results = this.props.records.filter(record => (record['o:title'] || '').includes(this.state.searchTerm));
			return this.props.filterRecords(results)
		}

	}
	setActiveCard = (record_id) => {
		this.setState({activeCard: record_id})
	}
	render () {
		const props = this.props;
		const state = this.state;
		return(
			// <div style={{ overflowY: 'auto', height: '90vh', overflowX: 'hidden', 'padding': '1rem' }}>
				// <div>
					<div>
						{this.props.viewMode === 'editing' ?
						// <div>
							<Button size='small'
								onClick={() => { props.setRecordEditorType('new'); props.setShowRecords(false) }}>
								{strings.new_record}
							</Button>
						// </div>
						: null}
						{/* <div width={ this.props.viewMode === 'editing' ? 9:15}>
							<Search
								fluid
								onSearchChange={(e, d) => this.searchChange(e, d)}
								showNoResults={false}
								size='small'
								onKeyDown={(e, d) => this.mouseClick(e, d)}
								placeholder='Press enter to submit'
							/>
						</div> */}
					{/* </div> */}
					{ this.props.viewMode === 'editing' ?
					<div>
					<table className="tablesaw tablesaw-stack neatline-records">
						<thead>
							<tr>
								<th
									sorted={state === 'o:title' ? state.direction : null}
									onClick={this.handleSort('o:title')}
									>Record Title</th>
								<th
									sorted={state === 'o:added' ? state.direction : null}
									onClick={this.handleSort('o:added')}
								>Record Created</th>
							</tr>
						</thead>
						<tbody>
							{props.filteredRecords.map(record => (
								<tr key={'record-' + record['o:id']} >
									<td style={{
										fontWeight: record === props.selectedRecord ? 'bold' : 'normal'
									}}>
										<b className="tablesaw-cell-label">Record Title</b>
										<span className="tablesaw-cell-content">
											<a className='ps_n3_exhibitTitle'
												// style={{ textOverflow: 'ellipsis', maxWidth: '8vw', whiteSpace: 'nowrap', overflow: 'hidden'}}
												onClick={() => { props.selectRecord({ record: record }); props.setShowRecords(false); props.setRecordEditorType('edit') }}
															>
												{record['o:title'] === null ? "???" : record['o:title']}
											</a>
											<ul className="actions">
												<li><a className="o-icon-edit" title="Edit Record" onClick={() => { props.selectRecord({ record: record }); props.setShowRecords(false); props.setRecordEditorType('edit') }} aria-label="Edit Record"></a></li>
												{props.userSignedIn &&
												<li>
												<a className="o-icon-delete"
												onClick={() => {
													this.props.dispatch(this.props.removeRecordFromCache(record['o:id']));
													this.props.deleteRecord(record);
												}}
												disabled={props.deleteInProgress}
												>
												</a>
												</li>
												}
											</ul>
										</span>
									</td>
									<td>
										<b className="tablesaw-cell-label">Record Created</b>
										<span className="tablesaw-cell-content">
										  {record['o:added'] === null ? "???" : record['o:added'].toString()}
										</span>
									</td>
								</tr>
							))
							}
						</tbody>
					</table>
					</div>
					//  :
					// <div>
					// 	{props.filteredRecords.map( record => (
					// 		<Card
					// 			style={{marginRight: '1.5em', marginLeft: '1.5em'}}
					// 			fluid
					// 			key={record['o:id']}
					// 			color={((this.props.selectedRecord !== null) && (record['o:id'] === this.props.selectedRecord['o:id']) )? 'blue': null }
					// 		>
					// 			<Card.Content
					// 				style={{ textOverflow: 'ellipsis', maxWidth: '8vw', whiteSpace: 'nowrap', overflow: 'hidden' }}
					// 				onClick={() => { this.setActiveCard(record['o:id']); props.selectRecord({ record: record }); }}
					// 				>
					// 				<Card.Header>{record['o:title']}</Card.Header>
					// 				<Card.Description>{record['o:body']}</Card.Description>
					// 			</Card.Content>
					// 		</Card>
					// 	))}
					// </div> 
					 : null }
				 {/* </div> */}
			</div>
		);
	}
}


const mapStateToProps = state => ({
	record:state.record,
	records: state.exhibitShow.records,
	selectedRecord: state.exhibitShow.selectedRecord,
	filteredRecords: state.exhibitShow.filteredRecords,
});

const mapDispatchToProps = dispatch => bindActionCreators({
	selectRecord,
	filterRecords,
	deleteRecord,
	removeRecordFromCache,
	dispatch
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Records);
