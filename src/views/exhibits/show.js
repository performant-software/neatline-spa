import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchExhibitWithRecords } from '../../modules/exhibitShow';
import ExhibitUpdate from './update';
import ExhibitPublicMap from '../../components/map';
import RecordInfoPanel from '../../components/info';

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

class ExhibitShow extends Component {
  componentWillMount() {
    this.props.fetchExhibitWithRecords(this.props.match.params.slug);
  }

  render() {
    const props = this.props;
    const exhibit = props.exhibit;

    let refreshButton = <button onClick={() => props.fetchExhibitWithRecords(props.match.params.slug)}>Refresh exhibit</button>
    let exhibitDisplay = <ExhibitShowHeader refreshButton={refreshButton}>Loading...</ExhibitShowHeader>;
    if (exhibit) {
      exhibitDisplay = (
        <div className='exhibit-public' style={{ height: '100%', display: 'grid', gridTemplateColumns: '320px 1fr', gridGap: 'none' }}>
          <div style={{ gridRow: '1', gridColumn: '1', padding: '1em', maxHeight: '100%', overflow: 'scroll' }}>
            <ExhibitShowHeader refreshButton={refreshButton}>{exhibit['o:title']}</ExhibitShowHeader>
            <ExhibitPanelContent exhibit={exhibit} userSignedIn={props.userSignedIn} />
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
  exhibitNotFound: state.exhibitShow.exhibitNotFound
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchExhibitWithRecords
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExhibitShow);
