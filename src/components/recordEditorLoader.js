import {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {openEditorToNewRecord,selectRecord} from '../actions';
class RecordEditorLoader extends Component {
	componentWillMount() {
		let recordID = this.props.match.params.recordId;
		if (recordID === 'new'){
			this.props.openEditorToNewRecord();
		}else{
			if(typeof this.props.records !== 'undefined'){
				this.props.records.forEach( record => {
					if(record['o:id'] === recordID){
						this.selectRecord(record);
					}
				});
			}
		}
	}

	render() {return null;}
}

const mapStateToProps = state => ({
	records: state.exhibitShow.records,
	record: state.exhibitShow.editorRecord,
	exhibitSlug: state.exhibitShow.exhibit['o:slug']
});

const mapDispatchToProps = dispatch => bindActionCreators({
	selectRecord,
	openEditorToNewRecord
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RecordEditorLoader);
