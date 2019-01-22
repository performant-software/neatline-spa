import 'react-tabs/style/react-tabs.css';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Route, Link} from 'react-router-dom';
import {fetchExhibits, setTabIndex, deselectRecord,fetchRecordsBySlug,updateRecordCache} from '../../actions';
import ExhibitUpdate from './update';
import ExhibitPublicMap from '../../components/ExhibitPublicMap';
import RecordInfoPanel from '../../components/info';
import RecordEditorLoader from '../../components/recordEditorLoader';
import Records from '../records';
import RecordCreate from '../records/create';
import RecordUpdate from '../records/update';
// import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import { strings } from '../../i18nLibrary';
import {recordCacheToDatabase, updateExhibitCache, clearRecordCache} from '../../actions';
import LockOverlay from '../../components/LockOverlay';
import SpinnerOverlay from '../../components/SpinnerOverlay';
import AlertBar from '../../components/AlertBar';
import { Tab } from 'semantic-ui-react';

const ExhibitShowHeader = props => (
	<div>
		{props.userSignedIn &&
			<div className="ps_n3_button save" onClick={props.onSave}>Save</div>}
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


class ExhibitShow extends Component {
	constructor(props) {
		super(props)
		this.state = {showRecords:true, recordEditorType: ''}
	}

	componentDidMount() {
		this.props.fetchExhibits();
		this.cacheIntitialized=false;
		this.exhibitCacheInitialized=false;
		this.props.dispatch(clearRecordCache());

	}

	saveAll = (event) => {
		this.props.dispatch(recordCacheToDatabase());
	}

	componentWillUpdate = () =>{
		if(	typeof this.props.records === 'undefined' &&
			typeof this.props.match.params.slug !== 'undefined' &&
			!this.props.recordsLoading){
				this.props.fetchRecordsBySlug(this.props.match.params.slug);
			}
	}

	toggleRecords = (val) => this.setState({ showRecords: val });

	recordEditorType = (val) => { this.setState({ recordEditorType: val })};

	render() {

		const props = this.props;
		const {exhibit} = props;
		let exhibitDisplay = <ExhibitShowHeader userSignedIn={props.userSignedIn}>{strings.loading}</ExhibitShowHeader>;
		
		if (exhibit) {
			const panes = [
				{
					menuItem: `${strings.exhibit}`,
					render: () => 
						<Tab.Pane>
							<ExhibitPanelContent 
							exhibit={exhibit}
							userSignedIn={props.userSignedIn} />
						</Tab.Pane>
				},
				{
					menuItem: `${strings.records}`,
					render: () => 
						<Tab.Pane> {this.state.showRecords ? 
							<Records exhibitShowURL={props.match.url}
							userSignedIn={props.userSignedIn}
							toggleRecords={this.toggleRecords}
							setRecordEditorType={this.recordEditorType} /> : 
							(this.state.recordEditorType === 'new' ? <RecordCreate toggleRecords={this.toggleRecords} deselect={props.deselectRecord} /> : <RecordUpdate toggleRecords={this.toggleRecords} deselect={props.deselectRecord}/>)
						 }
						</Tab.Pane>
				},
			]
			exhibitDisplay = (
				<div className='ps_n3_exhibit-public' style={{
					display: 'grid',
					gridTemplateColumns: '320px 1fr',
					gridGap: 'none'
				}}>
				{!props.recordsLoading && <Route path={`${props.match.url}/edit/:recordId`} render={props => {
								props.key = props.match.params.recordId;
								return (<RecordEditorLoader {...props}/>)
							}}/>
				}
				<div>

					<ExhibitShowHeader  userSignedIn={props.userSignedIn} onSave={this.saveAll}>
						{exhibit['o:title']}
					</ExhibitShowHeader>
					<Tab panes={panes} />
				</div>
				<div style={{
						gridRow: '1',
						gridColumn: '2',
						position: 'relative'
					}}>
					<ExhibitPublicMap
						userSignedIn={this.props.userSignedIn}
						mapCache = {this.props.mapCache}
						exhibit = {this.props.exhibit}
						records = {this.props.records}
						selectedRecord = {this.props.selectedRecord}
						previewedRecord = {this.props.previewedRecord}
						editorRecord = {this.props.editorRecord}
						editorNewRecord = {this.props.editorNewRecord}
						leafletState = {this.props.leaflet}
						exhibitShowURL={props.match.url}
						hasWarning={this.props.mapCache.hasUnsavedChanges}/>
					<RecordInfoPanel isVisible={!this.props.leaflet.isEditing}/>
				</div>
			</div>);

		} else if (props.exhibitsLoading) {
			exhibitDisplay = <ExhibitShowHeader userSignedIn={props.userSignedIn}>Loading...</ExhibitShowHeader>;
		} else if (props.exhibitsErrored) {
			exhibitDisplay = <ExhibitShowHeader userSignedIn={props.userSignedIn}>*ERROR*</ExhibitShowHeader>;
		} else if (props.exhibitNotFound) {
			exhibitDisplay = <ExhibitShowHeader userSignedIn={props.userSignedIn}>Exhibit with identifier "{props.match.params.slug}" not found</ExhibitShowHeader>;
		}
		return (
			<div className="ps_n3_exhibitShowContainer" style={{width:'100%',position:'relative'}}>
				<AlertBar isVisible={this.props.mapCache.hasUnsavedChanges} message="You have unsaved changes"/>
				<SpinnerOverlay isVisible={this.props.leaflet.isSaving || this.props.recordsLoading}/>
				<LockOverlay isVisible={this.props.leaflet.isEditing}/>
					  {exhibitDisplay}
			</div>);
	}
}

const mapStateToProps = state => ({
	userSignedIn: state.user.userSignedIn,
	exhibit: state.exhibitShow.exhibit,
	exhibits: state.exhibits,
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
	fetchExhibits,
	setTabIndex,
	deselectRecord,
	fetchRecordsBySlug,
	updateRecordCache,
	updateExhibitCache,
	dispatch
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ExhibitShow);
