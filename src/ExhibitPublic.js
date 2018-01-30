import React, { Component } from 'react';
import ExhibitPublicMap from './ExhibitPublicMap';
import ApiClient from './ApiClient';
import RecordInfoPanel from './RecordInfoPanel';

class ExhibitPublic extends Component {
  state = {
    records: [],
    selectedRecord: null,
    previewedRecord: null
  };

  constructor(props) {
    super(props);

    this.updateRecords = this.updateRecords.bind(this);
    this.selectRecord = this.selectRecord.bind(this);
    this.deselectRecord = this.deselectRecord.bind(this);
    this.previewRecord = this.previewRecord.bind(this);
    this.unpreviewRecord = this.unpreviewRecord.bind(this);

    this.updateRecords();
  }

  updateRecords() {
    const { exhibit } = this.props;

    ApiClient.loadRecords(exhibit['o:id'], records => {
      this.setState({
        records: records
      });
    });
  }

  selectRecord(record) {
    const toSelect = this.state.selectedRecord === record ? null : record;
    this.setState({
      selectedRecord: toSelect
    });
  }

  deselectRecord() {
    this.setState({
      selectedRecord: null
    });
  }

  previewRecord(record) {
    this.setState({
      previewedRecord: record
    });
  }

  unpreviewRecord() {
    this.setState({
      previewedRecord: null
    });
  }

  render() {
    const { exhibit, returnClick } = this.props;
    const { records, selectedRecord, previewedRecord } = this.state;

    return (
      <div className='exhibit-public' style={{ height: '100%' }}>
        <div style={{ height: '10%' }}>
          <h3 style={{ display: 'inline' }}><span onClick={returnClick} style={{ cursor: 'pointer' }}>Neatline &rsaquo;</span> {exhibit['o:title']}</h3>
          <button style={{ display: 'inline', marginLeft: '2em' }} onClick={this.updateRecords}>Refresh</button>
        </div>
        <div style={{ height: '90%', position: 'relative' }}>
          <ExhibitPublicMap exhibit={exhibit} records={records} selectedRecord={selectedRecord} previewedRecord={previewedRecord} recordClick={this.selectRecord} mapClick={this.deselectRecord} recordMouseEnter={this.previewRecord} recordMouseLeave={this.unpreviewRecord} />
          <RecordInfoPanel selectedRecord={selectedRecord} previewedRecord={previewedRecord} closeClick={this.deselectRecord} />
        </div>
      </div>
    );
  }
}

export default ExhibitPublic;
