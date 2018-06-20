import {
	urlFormat,
	recordsEndpoint,
	exhibitsEndpoint,
	parseRecordsJSON,
	parseExhibitsJSON
} from './apiHelper';
import {
	push
} from 'react-router-redux';

export const EXHIBIT_LOADING = 'exhibitShow/EXHIBIT_LOADING';
export const EXHIBIT_ERRORED = 'exhibitShow/EXHIBIT_ERRORED';
export const EXHIBIT_FETCH_SUCCESS = 'exhibitShow/EXHIBIT_FETCH_SUCCESS';
export const EXHIBIT_RESET = 'exhibitShow/EXHIBIT_RESET';
export const EXHIBIT_LOADED = 'exhibitShow/EXHIBIT_LOADED';
export const EXHIBIT_NOT_FOUND = 'exhibitShow/EXHIBIT_NOT_FOUND';
export const RECORD_SELECTED = 'exhibitShow/RECORD_SELECTED';
export const RECORD_DESELECTED = 'exhibitShow/RECORD_DESELECTED';
export const RECORD_PREVIEWED = 'exhibitShow/RECORD_PREVIEWED';
export const RECORD_UNPREVIEWED = 'exhibitShow/RECORD_UNPREVIEWED';
export const EDITOR_RECORD_SET = 'exhibitShow/EDITOR_RECORD_SET';
export const EDITOR_RECORD_UNSET = 'exhibitShow/EDITOR_RECORD_UNSET';
export const EDITOR_NEW_RECORD = 'exhibitShow/EDITOR_NEW_RECORD';
export const EDITOR_CLOSE_NEW_RECORD = 'exhibitShow/EDITOR_CLOSE_NEW_RECORD';
export const TAB_INDEX_SET = 'exhibitShow/TAB_INDEX';
export const RECORD_ADDED = 'exhibitShow/RECORD_ADDED';
export const RECORD_REPLACED = 'exhibitShow/RECORD_REPLACED';
export const RECORD_REMOVED = 'exhibitShow/RECORD_REMOVED';
// export const RECORD_COVERAGE_SET = 'exhibitShow/RECORD_COVERAGE_SET';

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
		case EXHIBIT_LOADING:
			return {
				...state,
				loading: action.loading
			};

		case EXHIBIT_ERRORED:
			return {
				...state,
				errored: action.errored
			};

		case EXHIBIT_FETCH_SUCCESS:
			return {
				...state,
				records: action.records
			};

		case EXHIBIT_RESET:
			return initialState;

		case EXHIBIT_LOADED:
			return {
				...state,
				exhibit: action.exhibit,
				exhibitNotFound: false
			};

		case EXHIBIT_NOT_FOUND:
			return {
				...state,
				exhibitNotFound: true
			};

		case RECORD_SELECTED:
			return {
				...state,
				selectedRecord: action.record
			};

		case RECORD_DESELECTED:
			return {
				...state,
				selectedRecord: null
			};

		case RECORD_PREVIEWED:
			return {
				...state,
				previewedRecord: action.record
			};

		case RECORD_UNPREVIEWED:
			return {
				...state,
				previewedRecord: null
			};

		case EDITOR_RECORD_SET:
			return {
				...state,
				editorRecord: action.record,
				selectedRecord: action.record,
				editorNewRecord: false,
				tabIndex: 2
			};

		case EDITOR_RECORD_UNSET:
			return {
				...state,
				editorRecord: null,
				selectedRecord: null,
				editorNewRecord: false,
				tabIndex: Math.min(state.tabIndex, 1)
			}

		case EDITOR_NEW_RECORD:
			return {
				...state,
				editorNewRecord: true,
				editorRecord: null,
				selectedRecord: null,
				tabIndex: 2
			}

		case EDITOR_CLOSE_NEW_RECORD:
			return {
				...state,
				editorNewRecord: false
			}

		case TAB_INDEX_SET:
			return {
				...state,
				tabIndex: action.tabIndex
			}

		case RECORD_ADDED:
			return {
				...state,
				records: state.records.concat(action.record)
			}

		case RECORD_REPLACED:
			return {
				...state,
				records: state.records.filter(r => r['o:id'].toString() !== action.record['o:id'].toString()).concat(action.record)
			}

		case RECORD_REMOVED:
			return {
				...state,
				records: state.records.filter(r => r['o:id'].toString() !== action.record['o:id'].toString())
			}

		// case RECORD_COVERAGE_SET:
		// 	let thisRecord = state.editorRecord ? Object.assign({}, state.editorRecord) : null;
    //   if (thisRecord)
		// 	   thisRecord['o:coverage'] = action.coverage;
		// 	return {
		// 		...state,
		// 		editorRecord: thisRecord
		// 	}

		default:
			return state;
	}
}

function setExhibitBySlugAndFetchRecords(exhibits, slug, dispatch) {
	const exhibit = exhibits.filter(e => e['o:slug'] === slug)[0];
	if (exhibit) {
		dispatch({
			type: EXHIBIT_LOADED,
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
				type: EXHIBIT_FETCH_SUCCESS,
				records
			}))
			.then(() => dispatch({
				type: EXHIBIT_LOADING,
				loading: false
			}))
			.catch(() => dispatch({
				type: EXHIBIT_ERRORED,
				errored: true
			}));
	} else {
		dispatch({
			type: EXHIBIT_NOT_FOUND
		});
	}
}

export function fetchExhibitWithRecords(slug) {
	return function(dispatch, getState) {
		dispatch({
			type: EXHIBIT_LOADING,
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
				type: EXHIBIT_ERRORED,
				errored: true
			}));
	};
}

export function resetExhibit() {
	return function(dispatch) {
		dispatch({
			type: EXHIBIT_RESET
		});
	};
}

export function selectRecord(record) {
	return function(dispatch, getState) {
		if (getState().exhibitShow.selectedRecord === record) {
			dispatch({
				type: RECORD_DESELECTED
			});
		} else {
			dispatch({
				type: RECORD_SELECTED,
				record
			});
			dispatch(push(`${window.baseRoute}/show/${getState().exhibitShow.exhibit['o:slug']}/edit/${record['o:id']}`));
		}
	}
}

export function deselectRecord() {
	return function(dispatch) {
		dispatch({
			type: RECORD_DESELECTED
		});
	}
}

export function previewRecord(record) {
	return function(dispatch) {
		dispatch({
			type: RECORD_PREVIEWED,
			record
		});
	}
}

export function unpreviewRecord() {
	return function(dispatch) {
		dispatch({
			type: RECORD_UNPREVIEWED
		});
	}
}

export function setEditorRecordById(id) {
	return function(dispatch, getState) {
		const records = getState().exhibitShow.records;
		const record = records.filter(r => r['o:id'].toString() === id)[0];
		if (record) {
			dispatch({
				type: EDITOR_RECORD_SET,
				record
			});
		}
	}
}

export function unsetEditorRecord() {
	return function(dispatch, getState) {
		dispatch({
			type: EDITOR_RECORD_UNSET
		});
		const exhibit = getState().exhibitShow.exhibit;
		if (exhibit)
			dispatch(push(`${window.baseRoute}/show/${exhibit['o:slug']}`))
	}
}

export function openEditorToNewRecord() {
	return function(dispatch) {
		dispatch({
			type: EDITOR_NEW_RECORD
		});
	}
}

export function setTabIndex(tabIndex) {
	return function(dispatch) {
		dispatch({
			type: TAB_INDEX_SET,
			tabIndex
		});
	}
}

// export function setCurrentRecordCoverage(coverage) {
// 	return function(dispatch) {
// 		dispatch({
// 			type: RECORD_COVERAGE_SET,
// 			coverage:coverage
// 		});
// 	}
// }
