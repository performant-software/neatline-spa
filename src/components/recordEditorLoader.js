import { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setEditorRecordById, openEditorToNewRecord } from '../modules/exhibitShow';

class RecordEditorLoader extends Component {
  componentWillMount() {
    const { recordId } = this.props.match.params;
    if (recordId === 'new')
      this.props.openEditorToNewRecord();
    else
      this.props.setEditorRecordById(this.props.match.params.recordId);
  }

  render() {
    return null;
  }
}

const mapStateToProps = state => ({
  record: state.exhibitShow.editorRecord
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setEditorRecordById,
  openEditorToNewRecord
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordEditorLoader);
