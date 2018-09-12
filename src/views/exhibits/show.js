import 'react-tabs/style/react-tabs.css';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Route, Link} from 'react-router-dom';
import {fetchExhibitWithRecords, setTabIndex, deselectRecord} from '../../actions';
import ExhibitUpdate from './update';
import ExhibitPublicMap from '../../components/ExhibitPublicMap';
import RecordInfoPanel from '../../components/info';
import RecordEditorLoader from '../../components/recordEditorLoader';
import Records from '../records';
import RecordCreate from '../records/create';
import RecordUpdate from '../records/update';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import { strings } from '../../i18nLibrary';
import {recordCacheToDatabase} from '../../actions';
import LockOverlay from '../../components/LockOverlay';
import SpinnerOverlay from '../../components/SpinnerOverlay';

const ExhibitShowHeader = props => (
	<div>
		<div className="ps_n3_button save" onClick={props.onSave}>Save</div>
		<h3><Link to={`${window.baseRoute}/`}>Neatline</Link> | {props.children}</h3>
	</div>
);

const ExhibitPanelContent = props => {
	if (props.userSignedIn) {
		return <ExhibitUpdate exhibit={props.exhibit}/>;
	} else {
		return <p>{props.exhibit['o:narrative']}</p>;
	}
}

const RecordEditor = props => {
	if (props.editorNewRecord) {
		return <RecordCreate/>;
	} else {
		return <RecordUpdate/>;
	}
}

class ExhibitShow extends Component {
	componentWillMount() {
		this.props.fetchExhibitWithRecords(this.props.match.params.slug);
		document.addEventListener("saveAll", this.saveAll);
	}

	componentWillUnMount(){
		document.removeEventListener("saveAll", this.saveAll);
	}

	saveAll = (event) => {
		// Save the cache to the DB
		console.log("Dispatching save...");
		this.props.dispatch(
			recordCacheToDatabase(
				{
					exhibit:this.props.exhibitCache.cache,
					records:this.props.mapCache.cache,
					selectedRecord:this.props.selectedRecord
				}
			)
		);
	}


	render() {
		// Wait for records to load
		if(this.props.recordsLoading){
			return null;
		}
		const props = this.props;
		const {exhibit} = props;

		let exhibitDisplay = <ExhibitShowHeader>{strings.loading}</ExhibitShowHeader>;

		let recordTitle = props.editorNewRecord?strings.new_record:props.editorRecord?props.editorRecord['o:title']:'';
		    recordTitle =(recordTitle === null || recordTitle.length === 0)?"???":recordTitle;

		if (exhibit) {
			exhibitDisplay = (
				<div className='exhibit-public' style={{
					height: '100%',
					display: 'grid',
					gridTemplateColumns: '320px 1fr',
					gridGap: 'none'
				}}>
				{!props.recordsLoading && <Route path={`${props.match.url}/edit/:recordId`} render={props => {
								props.key = props.match.params.recordId;
								return (<RecordEditorLoader {...props}/>)
							}}/>
				}
				<div className="ps_n3_exhibitShowContainer">
					<SpinnerOverlay isVisible={this.props.leaflet.isSaving}/>
					<LockOverlay isVisible={this.props.leaflet.isEditing}/>
					<ExhibitShowHeader onSave={this.saveAll}>
						{exhibit['o:title']}
					</ExhibitShowHeader>
					<Tabs selectedIndex={props.tabIndex} onSelect={tabIndex => props.setTabIndex(tabIndex)}>
						<TabList>
							<Tab>{strings.exhibit}</Tab>
							<Tab>{strings.records}</Tab>
							<Tab style={{
									visibility: props.editorRecord || props.editorNewRecord
										? 'visible'
										: 'hidden',
									maxWidth: '100px'
								}}>
								{recordTitle}
								<span onClick={e => {
										props.deselectRecord();
										e.stopPropagation();
									}} style={{
										fontWeight: 'bold'
									}}> [x]</span>
							</Tab>
						</TabList>
						<TabPanel>
							<ExhibitPanelContent exhibit={exhibit} userSignedIn={props.userSignedIn}/>
						</TabPanel>
						<TabPanel>
							<Records exhibitShowURL={props.match.url}/>
						</TabPanel>
						<TabPanel>
							<RecordEditor editorNewRecord={props.editorNewRecord}/>
						</TabPanel>
					</Tabs>
				</div>
				<div style={{
						gridRow: '1',
						gridColumn: '2',
						position: 'relative'
					}}>
					<ExhibitPublicMap/>
					<RecordInfoPanel isVisible={!this.props.leaflet.isEditing}/>
				</div>
			</div>);

		} else if (props.exhibitsLoading) {
			exhibitDisplay = <ExhibitShowHeader>Loading...</ExhibitShowHeader>;
		} else if (props.exhibitsErrored) {
			exhibitDisplay = <ExhibitShowHeader>Loading...</ExhibitShowHeader>;
		} else if (props.exhibitNotFound) {
			exhibitDisplay = <ExhibitShowHeader>Exhibit with identifier "{props.match.params.slug}" not found</ExhibitShowHeader>;
		}
		return (<div style={{height: '100%'}}>{exhibitDisplay}</div>);
	}
}

const mapStateToProps = state => ({
	userSignedIn: state.user.userSignedIn,
	exhibit: state.exhibitShow.exhibit,
	leaflet: state.leaflet,
	records: state.exhibitShow.records,
	recordsLoading: state.exhibitShow.loading,
	recordsErrored: state.exhibitShow.errored,
	exhibitNotFound: state.exhibitShow.exhibitNotFound,
	selectedRecord: state.exhibitShow.selectedRecord,
	editorRecord: state.exhibitShow.editorRecord,
	editorNewRecord: state.exhibitShow.editorNewRecord,
	tabIndex: state.exhibitShow.tabIndex,

	mapCache: state.mapCache,
	exhibitCache: state.exhibitCache
});

const mapDispatchToProps = dispatch => bindActionCreators({
	fetchExhibitWithRecords,
	setTabIndex,
	deselectRecord,
	dispatch
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ExhibitShow);
