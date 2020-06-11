import React, { Component } from 'react';
import { selectRecord, filterRecords, removeRecordFromCache, deleteRecord} from '../../actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Grid, Table, Search, TableRow } from 'semantic-ui-react';
import _ from 'lodash';
import { Link } from 'react-router-dom';

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

			<div style={{ overflowY: 'auto', height: '90vh', overflowX: 'hidden', 'padding': '1rem' }}>
				<Grid>
					<Grid.Row>
						<Grid.Column width={15}>
							<Search
								fluid
								onSearchChange={(e, d) => this.searchChange(e, d)}
								showNoResults={false}
								size='small'
								onKeyDown={(e, d) => this.mouseClick(e, d)}
								placeholder='Press enter to submit'
							/>
						</Grid.Column>
					</Grid.Row>
					{this.props.exhibitNarrative &&
						<Grid.Row>
							<Table>
								<Table.Header>
									<Table.Row>
										<Table.HeaderCell>
											Narrative
										</Table.HeaderCell>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									<TableRow>
										<Table.Cell>
											{this.props.exhibitNarrative}
										</Table.Cell>
									</TableRow>
								</Table.Body>
							</Table>
						</Grid.Row>
	}
					<Grid.Row>
						<Table celled selectable sortable	>
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell
										sorted={state.column === 'o:title' ? state.direction : null}
										onClick={this.handleSort('o:title')}
										>Record Title</Table.HeaderCell>
									<Table.HeaderCell
										sorted={state.column === 'o:added' ? state.direction : null}
										onClick={this.handleSort('o:added')}
									>Record Created</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{props.filteredRecords.map(record => (
									<Table.Row key={'record-' + record['o:id']} >
										<Table.Cell style={{
											fontWeight: record === props.selectedRecord ? 'bold' : 'normal'
										}}>
											{/* <div
												style={{ textOverflow: 'ellipsis', maxWidth: '8vw', whiteSpace: 'nowrap', overflow: 'hidden'}}
												onClick={() => { props.selectRecord({ record: record }); props.setShowRecords(true); props.setRecordEditorType('') }}
											>
												{record['o:title'] === null ? "???" : record['o:title']}
											</div> */}
											{/* 

												TODO: 	Create a component to show record details and link to it here.
														May be able to repurpose ../../components/info.js?

											*/}
											<Link
												to={`${window.baseRoute}${this.props.exhibitShowURL}/id`} 
											>
												{record['o:title'] === null ? "???" : record['o:title']}
											</Link>
										</Table.Cell>
										<Table.Cell>
											<div>
												{record['o:added'] === null ? "???" : record['o:added'].toString()}
											</div>
										</Table.Cell> 
									</Table.Row>
								))
								}
							</Table.Body>
						</Table>
					</Grid.Row> 
				</Grid>
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
