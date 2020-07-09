import 'react-tabs/style/react-tabs.css';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {fetchExhibits, setTabIndex, deselectRecord,fetchRecordsBySlug,updateRecordCache} from '../../actions';
import ExhibitUpdate from './update';
import ExhibitPublicMap from '../../components/ExhibitPublicMap';
import Timeline from '../../components/Timeline';
import RecordInfoPanel from '../../components/info';
import Records from '../records';
import RecordCreate from '../records/create';
import RecordUpdate from '../records/update';
// import { strings } from '../../i18nLibrary';
import {recordCacheToDatabase, updateExhibitCache, clearRecordCache, setShowExhibitSettings, setShowRecords, setRecordEditorType} from '../../actions';
import LockOverlay from '../../components/LockOverlay';
import SpinnerOverlay from '../../components/SpinnerOverlay';
import AlertBar from '../../components/AlertBar';
import { Grid, Menu, Button, Icon, Card } from 'semantic-ui-react';

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
				<div>
				<Menu stackable>
					<Menu.Item header as={Link} to={`${window.baseRoute}/`}>
						<span className="neatline-subhead">Neatline</span>
					</Menu.Item>
					<Menu.Item>
						<h1 className="neatline-title">{exhibit['o:title']}</h1>
					</Menu.Item>
					<Menu.Item>
						{showFullViewLink &&
						<a title="Fullscreen Editor" href={`${window.containerFullModeBaseRoute}/show/${exhibit['o:slug']}`} aria-label="Fullscreen Editor"><Icon name='external alternate' size='large'/></a>
						}
						{showReturnLink &&
						<a title="Return to Omeka Admin" href={`${window.containerReturnBaseRoute}/show/${exhibit['o:slug']}`} aria-label="Return to Omeka Admin"><Icon name='compress' size='large'/></a>
						}
					</Menu.Item>
					<Menu.Item position='right'>
						{this.props.userSignedIn ?
							<div>
							<Button icon toggle basic
								color={this.props.showExhibitSettings ? 'blue' : null}
								active={this.props.showExhibitSettings}
								onClick={()=>{
									this.props.setShowExhibitSettings(true);
									this.setViewMode('editing');
									this.props.setShowRecords(true);
									this.props.deselectRecord();
									}}>
								Exhibit Settings <Icon name="settings" />
							</Button>
							<Button icon toggle basic
								color={(!this.props.showExhibitSettings && this.state.viewMode === 'editing') ? 'blue' : null}
								active={!this.props.showExhibitSettings && this.state.viewMode === 'editing'}
								onClick={() => { this.props.setShowExhibitSettings(false); this.setViewMode('editing')}}>
								Records <Icon name="list" />
							</Button>
							<Button icon toggle basic
								color={this.state.viewMode === 'publicView' ? 'blue' : null}
								active={this.state.viewMode === 'publicView'}
								onClick={() => { this.props.setShowExhibitSettings(false); this.setViewMode('publicView'); this.props.setRecordEditorType(''); this.props.setShowRecords(true); this.props.deselectRecord()}}>
								Public View <Icon name="eye" />
							</Button>
							<Button icon
								onClick={this.saveAll}>
								Save <Icon name="save" />
							</Button>
							</div> 
							:
							<div>
								<Button
									icon
									toggle
									basic
									color={this.props.showExhibitSettings ? 'blue' : null}
									active={this.props.showExhibitSettings}
									onClick={() => {
										this.props.setShowExhibitSettings(true);
										this.props.setShowRecords(true);
										this.props.deselectRecord();
									}}>
									Exhibit Information <Icon name="info" />
								</Button>
								<Button
									icon
									toggle
									basic
									color={!this.props.showExhibitSettings ? 'blue' : null}
									active={!this.props.showExhibitSettings}
									onClick={() => this.props.setShowExhibitSettings(false)}>
									View Exhibit <Icon name="list" />
								</Button>
							</div>
						}
					</Menu.Item>
				</Menu>
				<Grid stackable>
					<Grid.Row style={{background : 'none'}}>
						{this.props.userSignedIn ?
							(this.props.showExhibitSettings ?
								<Grid.Column width={5}>
									<ExhibitPanelContent
										exhibit={this.props.exhibit}
										userSignedIn={this.props.userSignedIn} />
								</Grid.Column>
										:
								<Grid.Column width={5}>
									{this.showRecords()}
								</Grid.Column>
								)
								:
							(this.props.showExhibitSettings?
								<Grid.Column width={15}>
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
								</Grid.Column> :
								<Grid.Column width={5}>
									<Records exhibitShowURL={this.props.match.url}
										userSignedIn={this.props.userSignedIn}
										setShowRecords={this.props.setShowRecords}
										setRecordEditorType={this.props.setRecordEditorType}
										viewMode={'signedOut'} />
								</Grid.Column>
								)
							}
              {!(!this.props.userSignedIn && this.props.showExhibitSettings) &&
  							<Grid.Column floated='right' width={10}>
								<div className="neatline-exhibit" style={{marginBottom:"1rem"}}>
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
								<Timeline />
								</div>
  						</Grid.Column>
            }
					</Grid.Row>
				</Grid>
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
