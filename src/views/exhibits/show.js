import 'react-tabs/style/react-tabs.css';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {fetchExhibits, setTabIndex, deselectRecord,fetchRecordsBySlug,updateRecordCache} from '../../actions';
import ExhibitPublicMap from '../../components/ExhibitPublicMap';
import Records from '../records';
import { strings } from '../../i18nLibrary';
import {updateExhibitCache, clearRecordCache, setShowExhibitSettings, setShowRecords, setRecordEditorType} from '../../actions';
import { Grid, Menu, Button, Icon } from 'semantic-ui-react';

const ExhibitShowHeader = props => (
	<div>
		<h3><Link to={`${window.baseRoute}/`}>Neatline</Link> | {props.children}</h3>
	</div>
);

class ExhibitShow extends Component {
	constructor(props) {
		super(props)
		this.state = {
			records: this.props.filteredRecords,
		}
	}

	componentDidMount() {
		this.props.fetchExhibits();
		this.cacheIntitialized=false;
		this.exhibitCacheInitialized=false;
		this.props.dispatch(clearRecordCache());

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

	render() {

		const props = this.props;
		const {exhibit} = props;

		const showFullViewLink = window.containerFullMode === false && window.containerFullModeBaseRoute;

		const showReturnLink = !showFullViewLink && window.containerFullMode === true && window.containerReturnBaseRoute;

		let exhibitDisplay;
		if (exhibit && this.props.filteredRecords) {
			exhibitDisplay = (
				<div>
					<Menu size='massive'>
						<Menu.Item header as={Link} to={`${window.baseRoute}/`}><h3>NEATLINE! </h3></Menu.Item>
						<Menu.Item> {exhibit['o:title']}</Menu.Item>
						{(showFullViewLink || showReturnLink) &&
							<Menu.Item position='right'>
								{showFullViewLink &&
									<a href={`${window.containerFullModeBaseRoute}/show/${exhibit['o:slug']}`}>
									<Button
										icon
										toggle
										basic>
										{strings.full} <Icon name='expand' />
									</Button>
									</a>
								}
								{showReturnLink &&
									<a href={`${window.containerReturnBaseRoute}/show/${exhibit['o:slug']}`}>
									<Button
										icon
										toggle
										basic>
										{strings.contained} <Icon name='compress' />
									</Button>
									</a>
								}

							</Menu.Item>
						}
					</Menu>
				<Grid divided padded>
					<Grid.Row>
							<Grid.Column width={4}>
								<Records 
									exhibitShowURL={this.props.match.url}
									userSignedIn={this.props.userSignedIn}
									setShowRecords={this.props.setShowRecords}
									setRecordEditorType={this.props.setRecordEditorType}
									exhibitNarrative={exhibit['o:narrative']}
								/>
							</Grid.Column>
  							<Grid.Column floated='right' width={11}>
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
  									setRecordEditorType={this.props.setRecordEditorType}
  									setShowRecords={this.props.setShowRecords}
  								/>
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
