import React, { Component } from 'react';
import {selectRecord, filterRecords} from '../../actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { strings } from '../../i18nLibrary';
import { Grid, Button, Table, Search } from 'semantic-ui-react';
import _ from 'lodash';

class Records extends Component {

	componentWillMount() {
		this.resetSearch();
	}
	resetSearch = () => this.setState({ results: this.props.records, column: null, direction: null, 'searchTerm': '' });
	
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
			this.setState({ results: results });
			const resultIds = results.map(record => record['o:id'])
			console.log(resultIds)
			return this.props.filterRecords(resultIds)
		}
		
	}
	render () {
		const props = this.props;
		const state = this.state;
		return(
			<div style={{ overflowY: 'auto', height: '90vh', overflowX: 'hidden', 'padding': '1rem' }}>
				<Grid>
					<Grid.Row>
						<Grid.Column width={4}>
						{
							props.userSignedIn &&
							
							<Button size='small'
								onClick={() => {props.setRecordEditorType('new'); props.toggleRecords(false)}}>
								{strings.new_record}
							</Button>

						}
						</Grid.Column>
						<Grid.Column width={9}>
						<Search
							onSearchChange={(e, d) => this.searchChange(e, d)}
							showNoResults={false}
							size='small'
							onKeyDown={(e,d) => this.mouseClick(e,d)}
							placeholder='Press enter to submit'
						/>
						</Grid.Column>
					</Grid.Row>
				<Grid.Row>
				<Table celled selectable sortable>
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
						{state.results.map(record => (
							<Table.Row key={'record-' + record['o:id']} >
								<Table.Cell style={{
									fontWeight: record === props.selectedRecord ? 'bold' : 'normal'
								}}>
									<div onClick={() => { props.selectRecord({ record: record }); props.toggleRecords(false); props.setRecordEditorType('edit') }}>
										{record['o:title'] === null ? "???" : record['o:title']}
									</div>
								</Table.Cell>
								<Table.Cell>
									{record['o:added'] === null ? "???" : record['o:added']}
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
	filterRecords: state.exhibitShow.records.filter(record => (state.exhibitShow.filterRecordsIds || []).includes(record['o:id'])),
});

const mapDispatchToProps = dispatch => bindActionCreators({
	selectRecord,
	filterRecords,
	dispatch
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Records);
