import {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {openEditorToNewRecord,selectRecord} from '../actions';
import history from '../history';
class RecordEditorLoader extends Component {
	componentWillMount() {
		let recordID = this.props.match.params;
		if (recordID === 'new'){
			this.props.openEditorToNewRecord();
		}else{
			this.props.records.forEach( record => {
				if(record['o:id'] === recordID){
					this.selectRecord(record);
					history.push(`${window.baseRoute}/show/${this.props.exhibitSlug}/edit/${record['o:id']}`);
				}
			});
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
