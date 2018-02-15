import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { fetchExhibitWithRecords, setTabIndex, unsetEditorRecord } from '../../modules/exhibitShow';
import ExhibitUpdate from './update';
import ExhibitPublicMap from '../../components/map';
import RecordInfoPanel from '../../components/info';
import RecordEditorLoader from '../../components/recordEditorLoader';
import Records from '../records';
import RecordCreate from '../records/create';
import RecordUpdate from '../records/update';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const ExhibitShowHeader = props => (
  <div style={{ marginBottom: '1.5em' }}>
    <div><Link to={`${window.baseRoute}/`}>Neatline</Link> | {props.children}</div>
    {props.refreshButton}
  </div>
)

const ExhibitPanelContent = props => {
  if (props.userSignedIn) {
    return <ExhibitUpdate exhibit={props.exhibit} />;
  } else {
    return <p>{props.exhibit['o:narrative']}</p>;
  }
}

const RecordEditor = props => {
  if (props.editorNewRecord) {
    return <RecordCreate />;
  } else {
    return <RecordUpdate />;
  }
}

class ExhibitShow extends Component {
  componentWillMount() {
    this.props.fetchExhibitWithRecords(this.props.match.params.slug);
  }

  render() {
    const props = this.props;
    const { exhibit } = props;

    let refreshButton = <button onClick={() => props.fetchExhibitWithRecords(props.match.params.slug)}>Refresh exhibit</button>
    let exhibitDisplay = <ExhibitShowHeader refreshButton={refreshButton}>Loading...</ExhibitShowHeader>;
    if (exhibit) {
      exhibitDisplay = (
        <div className='exhibit-public' style={{ height: '100%', display: 'grid', gridTemplateColumns: '320px 1fr', gridGap: 'none' }}>
          {!props.recordsLoading &&
            <Route path={`${props.match.url}/edit/:recordId`} render={props => {
              props.key = props.match.params.recordId;
              return (
              <RecordEditorLoader {...props} />
            )}} />
          }
          <div style={{ gridRow: '1', gridColumn: '1', padding: '1em', maxHeight: '100%', overflow: 'scroll' }}>
            <ExhibitShowHeader refreshButton={refreshButton}>{exhibit['o:title']}</ExhibitShowHeader>
            <Tabs selectedIndex={props.tabIndex} onSelect={tabIndex => props.setTabIndex(tabIndex)}>
              <TabList>
                <Tab>Exhibit</Tab>
                <Tab>Records</Tab>
                <Tab style={{ visibility: props.editorRecord || props.editorNewRecord ? 'visible' : 'hidden', maxWidth: '100px' }}>
                  {props.editorNewRecord ? 'New record' : props.editorRecord ? props.editorRecord['o:title'] : ''}
                  <span onClick={ e => {props.unsetEditorRecord(); e.stopPropagation();}} style={{ fontWeight: 'bold' }}> x</span>
                </Tab>
              </TabList>
              <TabPanel>
                <ExhibitPanelContent exhibit={exhibit} userSignedIn={props.userSignedIn} />
              </TabPanel>
              <TabPanel>
                <Records exhibitShowURL={props.match.url} />
              </TabPanel>
              <TabPanel>
                <RecordEditor editorNewRecord={props.editorNewRecord} />
              </TabPanel>
            </Tabs>
          </div>
          <div style={{ gridRow: '1', gridColumn: '2', position: 'relative' }}>
            <ExhibitPublicMap />
            <RecordInfoPanel />
          </div>
        </div>
      );
    } else if (props.exhibitsLoading) {
      exhibitDisplay = <ExhibitShowHeader refreshButton={refreshButton}>Loading...</ExhibitShowHeader>;
    } else if (props.exhibitsErrored) {
      exhibitDisplay = <ExhibitShowHeader refreshButton={refreshButton}>Loading...</ExhibitShowHeader>;
    } else if (props.exhibitNotFound) {
      exhibitDisplay = <ExhibitShowHeader refreshButton={refreshButton}>Exhibit with identifier "{props.match.params.slug}" not found</ExhibitShowHeader>;
    }
    return (
      <div style={{ height: '100%' }}>
        {exhibitDisplay}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userSignedIn: state.user.userSignedIn,
  exhibit: state.exhibitShow.exhibit,
  records: state.exhibitShow.records,
  recordsLoading: state.exhibitShow.loading,
  recordsErrored: state.exhibitShow.errored,
  exhibitNotFound: state.exhibitShow.exhibitNotFound,
  selectedRecord: state.exhibitShow.selectedRecord,
  editorRecord: state.exhibitShow.editorRecord,
  editorNewRecord: state.exhibitShow.editorNewRecord,
  tabIndex: state.exhibitShow.tabIndex
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchExhibitWithRecords,
  setTabIndex,
  unsetEditorRecord
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExhibitShow);
