import 'react-tabs/style/react-tabs.css';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {fetchExhibits, setTabIndex, deselectRecord,fetchRecordsBySlug,updateRecordCache} from '../../actions';
import Menu from '../../components/Menu';
import ExhibitUpdate from './update';
import ExhibitPublicMap from '../../components/ExhibitPublicMap';
import RecordInfoPanel from '../../components/info';
import Records from '../records';
import RecordCreate from '../records/create';
import RecordUpdate from '../records/update';
// import { strings } from '../../i18nLibrary';
import {recordCacheToDatabase, updateExhibitCache, clearRecordCache, setShowExhibitSettings, setShowRecords, setRecordEditorType} from '../../actions';
import LockOverlay from '../../components/LockOverlay';
import SpinnerOverlay from '../../components/SpinnerOverlay';
import AlertBar from '../../components/AlertBar';
import { Grid, Button, Icon, Card } from 'semantic-ui-react';
import Breadcrumbs from '../../components/Breadcrumbs';
import ExhibitEditorButtons from '../../components/ExhibitEditorButtons';

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
		const viewMode = this.props.userSignedIn ? 'editing' : 'signedOut'
		this.state = {
			records: this.props.filteredRecords,
			viewMode: viewMode
		}
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

	componentDidUpdate = (prevProps) =>{
		if(	typeof this.props.filteredRecords === 'undefined' &&
			typeof this.props.match.params.slug !== 'undefined' &&
			!this.props.recordsLoading){
				this.props.fetchRecordsBySlug(this.props.match.params.slug);
			}
		if (this.props.filteredRecords !== prevProps.filteredRecords){
			this.setState({records: this.props.filteredRecords});
			this.props.dispatch(this.props.updateRecordCache(this.props.filteredRecords));
		}
	}

	showRecords = () => {
		return (this.props.showRecords ?
					<Records exhibitShowURL={this.props.match.url}
						userSignedIn={this.props.userSignedIn}
						setShowRecords={this.props.setShowRecords}
						setRecordEditorType={this.props.setRecordEditorType}
						viewMode={this.state.viewMode} /> :
					(this.props.recordEditorType === 'new' ? <RecordCreate setShowRecords={this.props.setShowRecords} deselect={this.props.deselectRecord} setRecordEditorType={this.props.setRecordEditorType} /> : <RecordUpdate setShowRecords={this.props.setShowRecords} deselect={this.props.deselectRecord} setRecordEditorType={this.props.setRecordEditorType}/>

				)
		);
	}

	showExhibitPanel = () => {
		// Should only show panel if signed in or out/ not for public viewing of exhibit
		return (
				this.props.showExhibitSettings ?
					<ExhibitPanelContent
						exhibit={this.props.exhibit}
						userSignedIn={this.props.userSignedIn} />
					:
					this.showRecords()
		)
	}

	setViewExhibitEditing = () => {
		this.setState({viewingExhibitEdit: !this.state.viewingExhibitEdit})
	}

	setViewMode = (val) => this.setState({viewMode: val})


	render() {

		const props = this.props;
		const {exhibit} = props;
		const showFullViewLink = window.containerFullMode === false && window.containerFullModeBaseRoute;
		const showReturnLink = !showFullViewLink && window.containerFullMode === true && window.containerReturnBaseRoute;

		let exhibitDisplay;
		if (exhibit) {
			exhibitDisplay = (
				<div className="show neatline" role="content">
					<Menu
						pageTitle="Exhibit Editor  "
						linkTitleFull="Fullscreen Editor"
						linkTitleReturn="Return to Omeka Admin"
						linkRefFull={`${window.containerFullModeBaseRoute}/show/${exhibit['o:slug']}`}
						linkRefReturn={`${window.containerReturnBaseRoute}/show/${exhibit['o:slug']}`}
						onClick={null}
						props={props}
						strings={null} 									
					/>
					<ExhibitEditorButtons
						onClickSettings={()=>{
							this.props.setShowExhibitSettings(true);
							this.setViewMode('editing');
							this.props.setShowRecords(true);
							this.props.deselectRecord();
							}}
						onClickRecords={() => {this.props.setShowExhibitSettings(false); this.setViewMode('editing')}}
						onClickPublic={() => { this.props.setShowExhibitSettings(false); this.setViewMode('publicView'); this.props.setRecordEditorType(''); this.props.setShowRecords(true); this.props.deselectRecord()}}
						onClickSave={this.saveAll}
					/>
					
					{/* <h1 className="neatline-actions">
						<span className="subhead">Neatline</span>
						<span className="title">Exhibit Editor  </span>
						{showFullViewLink &&
						<a className="o-icon-external public" title="Fullscreen Exhibit Editor" href={`${window.containerFullModeBaseRoute}/show/${exhibit['o:slug']}`} aria-label="Fullscreen Exhibit Editor"></a>
						}
						{showReturnLink &&
						<a className="o-icon-compress public" title="Return to Omeka Admin" href={`${window.containerReturnBaseRoute}/show/${exhibit['o:slug']}`} aria-label="Return to Omeka Admin"></a>
						}
						<div id="page-actions" className="neatline-actions menu-condensed">
							<button
								// className="o-icon-exhibit-settings button"
								color={this.props.showExhibitSettings ? 'blue' : null}
								active={this.props.showExhibitSettings}
								onClick={()=>{
							this.props.setShowExhibitSettings(true);
							this.setViewMode('editing');
							this.props.setShowRecords(true);
							this.props.deselectRecord();
							}}>
								<i className="fas fa-cogs"></i>
							</button>
							<button
								// className="o-icon-record button"
								color={(!this.props.showExhibitSettings && this.state.viewMode === 'editing') ? 'blue' : null}
								active={!this.props.showExhibitSettings && this.state.viewMode === 'editing'}
								onClick={() => { this.props.setShowExhibitSettings(false); this.setViewMode('editing')}}>
								<i className="fas fa-list-ul"></i>
							</button>
							<button
								// className="o-icon-public button"
								color={this.state.viewMode === 'publicView' ? 'blue' : null}
								active={this.state.viewMode === 'publicView'}
								onClick={() => { this.props.setShowExhibitSettings(false); this.setViewMode('publicView'); this.props.setRecordEditorType(''); this.props.setShowRecords(true); this.props.deselectRecord()}}>
								<i className="fas fa-eye"></i>
							</button>
							<button onClick={this.saveAll}>Save</button>
						</div>

					{this.props.userSignedIn ?
					<div id="page-actions" className="neatline-actions menu-full">
						<button
							// className="o-icon-exhibit-settings button"
							color={this.props.showExhibitSettings ? 'blue' : null}
							active={this.props.showExhibitSettings}
							onClick={()=>{
						this.props.setShowExhibitSettings(true);
						this.setViewMode('editing');
						this.props.setShowRecords(true);
						this.props.deselectRecord();
						}}>
						Exhibit Settings <i className="fas fa-cogs"></i>
						</button>
						<button
							// className="o-icon-record button"
							color={(!this.props.showExhibitSettings && this.state.viewMode === 'editing') ? 'blue' : null}
							active={!this.props.showExhibitSettings && this.state.viewMode === 'editing'}
							onClick={() => { this.props.setShowExhibitSettings(false); this.setViewMode('editing')}}>
							Records <i className="fas fa-list-ul"></i>
						</button>
						<button
							// className="o-icon-public button"
							color={this.state.viewMode === 'publicView' ? 'blue' : null}
							active={this.state.viewMode === 'publicView'}
							onClick={() => { this.props.setShowExhibitSettings(false); this.setViewMode('publicView'); this.props.setRecordEditorType(''); this.props.setShowRecords(true); this.props.deselectRecord()}}>
							Public View <i className="fas fa-eye"></i>
						</button>
						<button
							onClick={this.saveAll}>
							Save
						</button>
					</div> :
					<div id="page-actions">
						<button
							toggle
							basic
							color={this.props.showExhibitSettings ? 'blue' : null}
							active={this.props.showExhibitSettings}
							onClick={() => {
							this.props.setShowExhibitSettings(true);
							this.props.setShowRecords(true);
							this.props.deselectRecord();
						}}>
								Exhibit Information
						</button>
						<button
							toggle
							basic
							color={!this.props.showExhibitSettings ? 'blue' : null}
							active={!this.props.showExhibitSettings}
							onClick={() => this.props.setShowExhibitSettings(false)}>
							View Exhibit
						</button>
					</div>
					}
					<AlertBar isVisible={this.props.mapCache.hasUnsavedChanges} message="You have unsaved changes"/>
					</h1> */}

					<Breadcrumbs
						returnLink={`${window.baseRoute}/`}
					/>
					<div>
						<h3> {exhibit['o:title']} </h3>
					</div>
				<div className="neatline-wrapper">
					{/* <div className="neatline-content"> */}
					{this.props.userSignedIn ?
							( this.props.showExhibitSettings ?
								<div className="neatline-content">
									<ExhibitPanelContent
										exhibit={this.props.exhibit}
										userSignedIn={this.props.userSignedIn} />
								</div>
										:
								<div className="neatline-content">
									{this.showRecords()}
								</div>
								)
								:
							(this.props.showExhibitSettings?
								<div>
									<Card
										fluid
										style={{height: '80vh'}}
									>
										<Card.Content>
											<Card.Header>{exhibit['o:title']}</Card.Header>
										</Card.Content>
										<Card.Content>
											<Card.Description>{exhibit['o:narrative']}</Card.Description>
										</Card.Content>
									</Card>
								</div> :
								<div>
									<Records exhibitShowURL={this.props.match.url}
										userSignedIn={this.props.userSignedIn}
										setShowRecords={this.props.setShowRecords}
										setRecordEditorType={this.props.setRecordEditorType}
										viewMode={'signedOut'} />
								</div>
								)
							}
					{/* </div> */}
					{/* <div className="neatline-map"> */}
					{!(!this.props.userSignedIn && this.props.showExhibitSettings) &&
  							<div className="neatline-map">
  								<ExhibitPublicMap
  									userSignedIn={this.props.userSignedIn}
  									mapCache={this.props.mapCache}
  									exhibit={this.props.exhibit}
  									records={this.state.records}
  									selectedRecord={this.props.selectedRecord}
  									previewedRecord={this.props.previewedRecord}
  									editorRecord={this.props.editorRecord}
  									editorNewRecord={this.props.editorNewRecord}
  									leafletState={this.props.leaflet}
  									exhibitShowURL={this.props.match.url}
  									hasWarning={this.props.mapCache.hasUnsavedChanges}
  									isEditing={this.props.recordEditorType === 'edit' ? true : false}
  									showExhibitSettings={this.props.showExhibitSettings}
  									viewMode={this.state.viewMode}
  									setRecordEditorType={this.props.setRecordEditorType}
  									setShowRecords={this.props.setShowRecords}
  								/>
  								<RecordInfoPanel isVisible={!this.props.showExhibitSettings && !this.props.leaflet.isEditing} />
  						</div>
					}
					{/* </div> */}
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
			<div>
			{/* <div className="ps_n3_exhibitShowContainer" style={{width:'100%',position:'relative'}}> */}
				{/* <AlertBar isVisible={this.props.mapCache.hasUnsavedChanges} message="You have unsaved changes"/> */}
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
	filteredRecords: state.exhibitShow.filteredRecords,
	recordsLoading: state.exhibitShow.loading,
	recordsErrored: state.exhibitShow.errored,
	exhibitNotFound: state.exhibitShow.exhibitNotFound,
	selectedRecord: state.exhibitShow.selectedRecord,
	editorRecord: state.exhibitShow.editorRecord,
	editorNewRecord: state.exhibitShow.editorNewRecord,
	tabIndex: state.exhibitShow.tabIndex,
	mapCache: state.mapCache,
	exhibitCache: state.exhibitCache,
	recordEditorType: state.exhibitShow.recordEditorType,
	showExhibitSettings: state.exhibitShow.showExhibitSettings,
	showRecords: state.exhibitShow.showRecords,
});

const mapDispatchToProps = dispatch => bindActionCreators({
	fetchExhibits,
	setTabIndex,
	deselectRecord,
	fetchRecordsBySlug,
	updateRecordCache,
	updateExhibitCache,
	setRecordEditorType,
	setShowExhibitSettings,
	setShowRecords,
	dispatch
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ExhibitShow);
