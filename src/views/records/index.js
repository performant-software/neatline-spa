import React, { Component } from 'react';
import {selectRecord} from '../../actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { strings } from '../../i18nLibrary';
import { Grid, Button, Table, Search } from 'semantic-ui-react';
import _ from 'lodash';

class Records extends Component {

	componentWillMount() {
		this.resetSearch();
	}
	resetSearch = () => this.setState({ results: this.props.records, column: null, direction: null });
	
	searchChange = (e, d) => {
		if (d.value.length < 1) return this.resetSearch()
		let results = this.props.records.filter(record => record['o:title'].includes(d.value) );
		this.setState({results: results});
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
	render () {
		const props = this.props;
		const state = this.state;
		return(
			<div className = "ps_n3_recordFormContainer">
				<Grid centered>
					<Grid.Row>
						{
							props.userSignedIn &&
							
							<Button size='tiny'
								onClick={() => {props.setRecordEditorType('new'); props.toggleRecords(false)}}>
								{strings.new_record}
							</Button>

						}
						<Search
							onSearchChange={(e, d) => this.searchChange(e, d)}
							showNoResults={false}
							size='mini'
						/>
					</Grid.Row>
				</Grid>
				<Table basic='very' celled collapsing selectable sortable>
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
			</div>
		);
	}
} 


const mapStateToProps = state => ({
	record:state.record,
	records: state.exhibitShow.records,
	selectedRecord: state.exhibitShow.selectedRecord,
});

const mapDispatchToProps = dispatch => bindActionCreators({
	selectRecord,
	dispatch
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Records);
