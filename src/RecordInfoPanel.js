import React from 'react';

function RecordInfoPanel(props) {
  const { selectedRecord, previewedRecord, closeClick } = props;
  const record = selectedRecord || previewedRecord;

  if (record) {
    return (
      <div style={{ position: 'absolute', top: '12px', left: '54px', maxWidth: '400px', backgroundColor: 'white', opacity: 0.9, textAlign: 'left', padding: '10px', zIndex: '999' }}>
        {selectedRecord &&
          <div style={{ float: 'right', cursor: 'pointer' }} onClick={closeClick}>x</div>
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

export default RecordInfoPanel;
