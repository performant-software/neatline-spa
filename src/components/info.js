import React from 'react';
import { deselectRecord } from '../reducers/not_refactored/exhibitShow';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

function RecordInfoPanel(props) {
  const { selectedRecord, previewedRecord, closeClick } = props;
  const record = selectedRecord || previewedRecord;

  if (record) {
    return (
      <div className={props.mapPreview.hasUnsavedChanges?"ps_n3_info_component_withWarning":"ps_n3_info_component"}>
        {selectedRecord &&
          <div className="ps_n3_closeButton" onClick={closeClick}>x</div>
        }
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
	mapPreview: state.mapPreview,
	selectedRecord: state.exhibitShow.selectedRecord,
	previewedRecord: state.exhibitShow.previewedRecord
});

const mapDispatchToProps = dispatch => bindActionCreators({
  closeClick: deselectRecord
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RecordInfoPanel);
