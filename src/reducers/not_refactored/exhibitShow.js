import {
	urlFormat,
	recordsEndpoint,
	exhibitsEndpoint,
	parseRecordsJSON,
	parseExhibitsJSON
} from '../../sagas/api_helper.js';
import {push} from 'react-router-redux';

import * as ACTION_TYPE from '../../actions/action-types';

const initialState = {
	records: [],
	exhibit: null,
	loading: false,
	errored: false,
	exhibitNotFound: false,
	selectedRecord: null,
	previewedRecord: null,
	editorRecord: null,
	editorNewRecord: false,
	tabIndex: 0
};

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
			return {
				...state,
				selectedRecord: action.record
			};

		case ACTION_TYPE.RECORD_DESELECTED:
			return {
				...state,
				selectedRecord: null
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

		case ACTION_TYPE.EDITOR_RECORD_SET:
			return {
				...state,
				editorRecord: action.record,
				selectedRecord: action.record,
				editorNewRecord: false,
				tabIndex: 2
			};

		case ACTION_TYPE.EDITOR_RECORD_UNSET:
			return {
				...state,
				editorRecord: null,
				selectedRecord: null,
				editorNewRecord: false,
				tabIndex: Math.min(state.tabIndex, 1)
			}

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
				editorRecord:action.record,
				selectedRecord: action.record
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

function setExhibitBySlugAndFetchRecords(exhibits, slug, dispatch) {
	const exhibit = exhibits.filter(e => e['o:slug'] === slug)[0];
	if (exhibit) {
		dispatch({
			type: ACTION_TYPE.EXHIBIT_LOADED,
			exhibit
		});
		return fetch(urlFormat(recordsEndpoint, {
				exhibit_id: exhibit['o:id']
			}))
			.then(function(response) {
				if (!response.ok) {
					throw Error(response.statusText);
				}
				return response;
			})
			.then(response => parseRecordsJSON(response))
			.then(records => dispatch({
				type: ACTION_TYPE.EXHIBIT_FETCH_SUCCESS,
				records
			}))
			.then(() => dispatch({
				type: ACTION_TYPE.EXHIBIT_LOADING,
				loading: false
			}))
			.catch(() => dispatch({
				type: ACTION_TYPE.EXHIBIT_ERRORED,
				errored: true
			}));
	} else {
		dispatch({
			type: ACTION_TYPE.EXHIBIT_NOT_FOUND
		});
	}
}

export function fetchExhibitWithRecords(slug) {
	return function(dispatch, getState) {
		dispatch({
			type: ACTION_TYPE.EXHIBIT_LOADING,
			loading: true
		});
		const exhibits = getState().exhibits.exhibits;
		if (exhibits && exhibits.length > 0)
			return setExhibitBySlugAndFetchRecords(exhibits, slug, dispatch);
		return fetch(urlFormat(exhibitsEndpoint))
			.then((response) => {
				if (!response.ok) {
					throw Error(response.statusText);
				}
				return response;
			})
			.then(response => parseExhibitsJSON(response))
			.then(exhibits => setExhibitBySlugAndFetchRecords(exhibits, slug, dispatch))
			.catch(() => dispatch({
				type: ACTION_TYPE.EXHIBIT_ERRORED,
				errored: true
			}));
	};
}

export function resetExhibit() {
	return function(dispatch) {
		dispatch({
			type: ACTION_TYPE.EXHIBIT_RESET
		});
	};
}

export function selectRecord(record) {
	return function(dispatch, getState) {
		if (getState().exhibitShow.selectedRecord === record) {
			dispatch({
				type: ACTION_TYPE.RECORD_DESELECTED
			});
		} else {
			dispatch({
				type: ACTION_TYPE.RECORD_SELECTED,
				record
			});
			dispatch(push(`${window.baseRoute}/show/${getState().exhibitShow.exhibit['o:slug']}/edit/${record['o:id']}`));
		}
	}
}

export function deselectRecord() {
	return function(dispatch) {
		dispatch({
			type: ACTION_TYPE.RECORD_DESELECTED
		});
	}
}

export function previewRecord(record) {
	return function(dispatch) {
		dispatch({
			type: ACTION_TYPE.RECORD_PREVIEWED,
			record
		});
	}
}

export function unpreviewRecord() {
	return function(dispatch) {
		dispatch({
			type: ACTION_TYPE.RECORD_UNPREVIEWED
		});
	}
}

export function setEditorRecordById(id) {
	return function(dispatch, getState) {
		const records = getState().exhibitShow.records;
		const record = records.filter(r => r['o:id'].toString() === id)[0];
		if (record) {
			dispatch({
				type: ACTION_TYPE.EDITOR_RECORD_SET,
				record
			});
		}
	}
}

export function unsetEditorRecord() {
	return function(dispatch, getState) {
		dispatch({type: ACTION_TYPE.RECORD_CACHE_CLEAR_UNSAVED});
		dispatch({type: ACTION_TYPE.EDITOR_RECORD_UNSET});
		const exhibit = getState().exhibitShow.exhibit;
		if (exhibit)
			dispatch(push(`${window.baseRoute}/show/${exhibit['o:slug']}`))
	}
}

export function openEditorToNewRecord() {
	return function(dispatch) {
		dispatch({
			type: ACTION_TYPE.EDITOR_NEW_RECORD
		});
	}
}

export function setTabIndex(tabIndex) {
	return function(dispatch) {
		dispatch({
			type: ACTION_TYPE.TAB_INDEX_SET,
			tabIndex
		});
	}
}

export function setCurrentRecordCoverage(coverage) {
	return function(dispatch) {
		dispatch({
			type: ACTION_TYPE.RECORD_COVERAGE_SET,
			coverage:coverage
		});
	}

}
