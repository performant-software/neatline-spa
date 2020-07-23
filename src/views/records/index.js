import React, { Component } from 'react';
import { selectRecord, filterRecords, removeRecordFromCache, deleteRecord} from '../../actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { strings } from '../../i18nLibrary';
import { Icon, Button, Search, Card } from 'semantic-ui-react';
// import _ from 'lodash';

class Records extends Component {
	constructor(props){
		super(props)
		this.state = { activeCard: null };
	}
	componentWillMount() {
		this.setState({ column: null, direction: null});
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
				results: results.sort(function(a, b) {
					if (a[clickedColumn] != null && b[clickedColumn] != null) {
						if (clickedColumn === 'o:title'){
						 return a[clickedColumn].toUpperCase().localeCompare(b[clickedColumn].toUpperCase());
						} 
						if (clickedColumn === 'o:added'){
						 return new Date(a[clickedColumn]) - new Date(b[clickedColumn]);
						} else {
						 return new Date(a['o:added']) - new Date(b['o:added']);
						}
					} else {
						return new Date(a['o:added']) - new Date(b['o:added']);
					}
				}),
				direction: 'ascending',
			})
			return
		}

		this.setState({
			results: this.props.filteredRecords.reverse(),
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
			<div className="nl-records-editor">
			{this.props.viewMode === 'editing' ?
			<div>
				<Search
					fluid
					onSearchChange={(e, d) => this.searchChange(e, d)}
					showNoResults={false}
					size='small'
					onKeyDown={(e, d) => this.mouseClick(e, d)}
					placeholder='Press enter to submit'
				/>
				<Button size='medium' fluid icon color='blue'
					onClick={() => { props.setRecordEditorType('new'); props.setShowRecords(false) }}>
					{strings.new_record} <Icon name="sticky note outline" /></Button>
				</div>
			: null }
			{ this.props.viewMode === 'editing' ?
				<table className="tablesaw neatline tablesaw-stack neatline-records">
				<thead>
					<tr>
						<th
							className={state.column === 'o:title' ? state.direction : null}
							onClick={this.handleSort('o:title')}
							>Record Title</th>
						<th
							className={state.column === 'o:added' ? state.direction : null}
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
									<a 
										className='ps_n3_exhibitTitle'
										onClick={() => { props.selectRecord({ record: record }); props.setShowRecords(false); props.setRecordEditorType('edit') }}
									>{record['o:title'] === null ? "???" : record['o:title']}
									</a>
									<ul className="actions neatline">
										<li>
											<a title="Edit Record" onClick={() => { props.selectRecord({ record: record }); props.setShowRecords(false); props.setRecordEditorType('edit') }} aria-label="Edit Record">
											<Icon name="pencil alternate" /></a>
										</li>
										{props.userSignedIn &&
										<li>
											<a
											onClick={() => {
												this.props.dispatch(this.props.removeRecordFromCache(record['o:id']));
												this.props.deleteRecord(record);
											}}
											disabled={props.deleteInProgress}
											><Icon name="trash alternate"/>
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
			: <div className="ps_n3_exhibitFormContainer">
			{props.filteredRecords.map( record => (
					<Card
						style={{marginTop:'4px'}}
						fluid
						key={record['o:id']}
						color={((this.props.selectedRecord !== null) && (record['o:id'] === this.props.selectedRecord['o:id']) )? 'blue': null }
					>
						<Card.Content
							onClick={() => { this.setActiveCard(record['o:id']); props.selectRecord({ record: record }); }}
							>
							<Card.Header>{record['o:title']}</Card.Header>
							<Card.Description
							 style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}
							>{record['o:body']}</Card.Description>
						</Card.Content>
					</Card>
				))}
				</div>
			}
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
