import initialState from './exhibitShow-initialState';
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

		case ACTION_TYPE.RECORDS_LOADING:
			return {
				...state,
				loading: action.payload
			};

		case ACTION_TYPE.RECORDS_FETCH_SUCCESS:
			return {
				...state,
				records: action.payload,
				loading: false
			};

		case ACTION_TYPE.RECORDS_FILTER:
			return {
				...state,
				filteredRecords: action.payload
			};

		case ACTION_TYPE.EXHIBIT_RESET:
			return initialState;

		case ACTION_TYPE.EXHIBIT_LOADED:
			return {
				...state,
				exhibit: action.payload,
				exhibitNotFound: false
			};

		case ACTION_TYPE.EXHIBIT_NOT_FOUND:
			return {
				...state,
				exhibitNotFound: true
			};

		case ACTION_TYPE.SHOW_RECORDS:
			return {
				...state,
				showRecords: action.payload
			};

		case ACTION_TYPE.SHOW_EXHIBIT_SETTINGS:
			return {
				...state,
				showExhibitSettings: action.payload
			};

		case ACTION_TYPE.RECORD_EDITOR_TYPE:
			return {
				...state,
				recordEditorType: action.payload,
			}
		case ACTION_TYPE.RECORD_SELECTED:
			let record = action.payload.record;
			if (typeof record !== 'undefined' && record !== null) {
				return {
					...state,
					selectedRecord: record,
					editorRecord: record,
					editorNewRecord: false,
					tabIndex: 2
				};
			} else {
				return {
					...state
				};
			}

		case ACTION_TYPE.RECORD_DESELECTED:
			return {
				...state,
				editorRecord: null,
				selectedRecord: null,
				editorNewRecord: false,
				tabIndex: Math.min(state.tabIndex, 1)
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
				editorNewRecord: false,
        recordEditorType: ''
			}

		case ACTION_TYPE.TAB_INDEX_SET:
			return {
				...state,
				tabIndex: action.payload
			}

		case ACTION_TYPE.RECORD_ADDED:
			return {
				...state,
				records: state.records.concat(action.record),
				editorRecord: action.record,
				selectedRecord: action.record,
				filteredRecords: state.filteredRecords.concat(action.record),
			}

		case ACTION_TYPE.RECORD_REPLACED:
      // console.log('START of RECORD_REPLACED - selectedRecord')
			return {
				...state,
				records: state.records.filter(r => r['o:id'].toString() !== action.record['o:id'].toString()).concat(action.record),
				// editorRecord: action.record,
				filteredRecords: state.filteredRecords.filter(r => r['o:id'].toString() !== action.record['o:id'].toString()).concat(action.record)
				/* selectedRecord: action.record */
			}

		case ACTION_TYPE.RECORD_REMOVED:
			return {
				...state,
				records: state.records.filter(r => r['o:id'].toString() !== action.record['o:id'].toString()),
				editorRecord: null,
				selectedRecord: null,
				tabIndex: 1,
				filteredRecords: state.filteredRecords.filter(r => r['o:id'].toString() !== action.record['o:id'].toString())
			}

		// FIXME: Remove this and have map use hidden form
		case ACTION_TYPE.RECORD_COVERAGE_SET:
			if (state.editorRecord !== null) {
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
