import initialState from './exhibitCache-initialState';
import * as ACTION_TYPE from '../../actions/action-types';



export default function(state = initialState, action) {

	switch (action.type) {
		case ACTION_TYPE.EXHIBIT_LOADING:
			return {
				...state,
				loading: action.loading
			};

		case ACTION_TYPE.EXHIBIT_ERRORED:
			return {
				...state,
				errored: action.errored
			};

		case ACTION_TYPE.EXHIBIT_FETCH_SUCCESS:
			return {
				...state,
				records: action.records
			};

		case ACTION_TYPE.EXHIBIT_RESET:
			return initialState;

		case ACTION_TYPE.EXHIBIT_LOADED:
			return {
				...state,
				exhibit: action.exhibit,
				exhibitNotFound: false
			};

		case ACTION_TYPE.EXHIBIT_NOT_FOUND:
			return {
				...state,
				exhibitNotFound: true
			};

		case ACTION_TYPE.RECORD_SELECTED:
			let record = action.payload;
			if(typeof record !== 'undefined' && record !== null){
				// FIXME: Tab switch broken
				return {
					...state,
					selectedRecord: record,
					editorRecord: record,
					editorNewRecord: false
					//,tabIndex: 2
				};
			}else{
				return {
					...state,
				};
			}



		case ACTION_TYPE.RECORD_DESELECTED:
			return {
				...state,
				editorRecord: null,
				selectedRecord: null,
				editorNewRecord: false
				//tabIndex: Math.min(state.tabIndex, 1)
			};


		case ACTION_TYPE.RECORD_PREVIEWED:
			return {
				...state,
				previewedRecord: action.record
			};

		case ACTION_TYPE.RECORD_UNPREVIEWED:
			return {
				...state,
				previewedRecord: null
			};



		case ACTION_TYPE.EDITOR_NEW_RECORD:
			return {
				...state,
				editorNewRecord: true,
				editorRecord: null,
				selectedRecord: null,
				tabIndex: 2
			}


		case ACTION_TYPE.EDITOR_CLOSE_NEW_RECORD:
			return {
				...state,
				editorNewRecord: false
			}

		case ACTION_TYPE.TAB_INDEX_SET:
			return {
				...state,
				tabIndex: action.tabIndex
			}

		case ACTION_TYPE.RECORD_ADDED:
			return {
				...state,
				records: state.records.concat(action.record),
				editorRecord:action.record,
				selectedRecord: action.record
			}

		case ACTION_TYPE.RECORD_REPLACED:
			return {
				...state,
				records: state.records.filter(r => r['o:id'].toString() !== action.record['o:id'].toString()).concat(action.record),
				editorRecord:action.record
				/*selectedRecord: action.record*/
			}

		case ACTION_TYPE.RECORD_REMOVED:
			return {
				...state,
				records: state.records.filter(r => r['o:id'].toString() !== action.record['o:id'].toString()),
				editorRecord:null,
				selectedRecord: null,
				tabIndex:1
			}

		// Remove this and have map use hidden form
		case ACTION_TYPE.RECORD_COVERAGE_SET:
			if( state.editorRecord !== null){
				var thisRecord = state.editorRecord;
				thisRecord['o:coverage'] = action.coverage;
				return {
					...state,
					editorRecord: thisRecord
				}
			}
			return state;



		default:
			return state;
	}


}
