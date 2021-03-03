import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Header, Segment } from 'semantic-ui-react';
import { fetchMap, setShowRecords } from '../../actions';
import ExhibitPublicMap from '../../components/ExhibitPublicMap';
import RecordInfoPanel from '../../components/info';
import SpinnerOverlay from '../../components/SpinnerOverlay';

const MapShow = (props) => {
  useEffect(() => {
    props.fetchMap(props.exhibitId);
  }, []);

  if (!props.exhibit) {
    return null;
  }

  return (
    <Segment
      padded
      style={{
        position: 'relative'
      }}
    >
      <Header
        content={props.exhibit && props.exhibit['o:title']}
      />
      <SpinnerOverlay
        isVisible={props.loading}
      />
      <ExhibitPublicMap
        exhibit={props.exhibit}
        exhibitCache={props.exhibitCache}
        mapCache={props.mapCache}
        mapKey={props.exhibitId}
        records={props.records}
        selectedRecord={props.record}
      />
      <RecordInfoPanel
        isVisible={!!props.record}
        style={{
          top: '40px',
          left: '3rem'
        }}
      />
    </Segment>
  );
};

const mapStateToProps = (state) => ({
  exhibit: state.mapShow.exhibit,
  exhibitCache: state.exhibitCache,
  loading: state.mapShow.loading,
  mapCache: state.mapCache,
  records: state.mapShow.records,
  record: state.mapShow.record
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchMap,
  setShowRecords,
  dispatch
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapShow);
