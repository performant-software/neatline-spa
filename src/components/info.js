import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

function RecordInfoPanel(props) {
  const { selectedRecord, previewedRecord} = props;
  const record = selectedRecord || previewedRecord;

  if (record) {

	  let className = props.mapCache.hasUnsavedChanges?"ps_n3_info_component_withWarning":"ps_n3_info_component";
	  	  className = props.isVisible?className:"hidden";
    return (
      <div className={className}>
        <div style={{ marginRight: '20px' }}>{record['o:title']}</div>
        {selectedRecord &&
          <div>
            <hr />
            <p>{record['o:body']}</p>
          </div>
        }
      </div>
    )
  }

  return null;
}

const mapStateToProps = state => ({
	mapCache: state.mapCache,
	selectedRecord: state.exhibitShow.selectedRecord,
	previewedRecord: state.exhibitShow.previewedRecord
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RecordInfoPanel);
