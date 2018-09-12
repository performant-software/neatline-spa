import * as ACTION_TYPE from './action-types';
import {urlFormat, recordsEndpoint, exhibitsEndpoint, parseRecordsJSON, parseExhibitsJSON} from '../sagas/api_helper.js';
import history from '../history';
import { strings } from '../i18nLibrary';

// Action Helper
function action(type, payload = {}) {
	return {type, payload}
}

// Action dispatchers
export const preview_baseLayer = (payload) => action(ACTION_TYPE.PREVIEW_BASELAYER, payload);
export const set_availableTileLayers = (payload) => action(ACTION_TYPE.SET_AVAILABLE_TILELAYERS, payload);

export const createRecord = (payload) => action(ACTION_TYPE.RECORD_CREATE, payload);
export const updateRecord = (payload) => action(ACTION_TYPE.RECORD_UPDATE, payload);
export const deleteRecord = (payload) => action(ACTION_TYPE.RECORD_DELETE, payload);

export const setUnsavedChanges = (payload) => action(ACTION_TYPE.HAS_UNSAVED_CHANGES, payload);

export const updateRecordCache = (payload) => action(ACTION_TYPE.RECORD_CACHE_UPDATE, payload);
export const updateExhibitCache = (payload) => action(ACTION_TYPE.EXHIBIT_CACHE_UPDATE, payload);
export const recordCacheToDatabase = (payload) => action(ACTION_TYPE.EXHIBIT_CACHE_SAVE, payload);

export const fetchExhibits = () => action(ACTION_TYPE.EXHIBIT_FETCH);
export const updateExhibit = (payload) => action(ACTION_TYPE.EXHIBIT_UPDATE, payload);

export const clearRecordCache = () => action(ACTION_TYPE.RECORD_CACHE_CLEAR);
export const removeRecordFromCache = (payload) => action(ACTION_TYPE.RECORD_CACHE_REMOVE_RECORD, payload);
export const clearUnsavedRecordCache = () => action(ACTION_TYPE.RECORD_CACHE_CLEAR_UNSAVED);

export const leafletIsEditing = (payload) => action(ACTION_TYPE.LEAFLET_IS_EDITING, payload);
export const leafletIsSaving = (payload) => action(ACTION_TYPE.LEAFLET_IS_SAVING, payload);


export const resetExhibit = () => action(ACTION_TYPE.EXHIBIT_RESET);

export const previewRecord = (payload) => action(ACTION_TYPE.RECORD_PREVIEWED, payload);
export const unpreviewRecord = () => action(ACTION_TYPE.RECORD_UNPREVIEWED);
export const openEditorToNewRecord = () => action(ACTION_TYPE.EDITOR_NEW_RECORD);
export const setTabIndex = (payload) => action(ACTION_TYPE.TAB_INDEX_SET, payload);
export const setCurrentRecordCoverage = (payload) => action(ACTION_TYPE.RECORD_COVERAGE_SET, payload);


// FIXME:  Here be dragons
// The code below is old and needs to be refactored so that it behaves like proper action dispatcher + saga (follow pattern above)

const setExhibitBySlugAndFetchRecords = (exhibits, slug, dispatch) => {
	const exhibit = exhibits.filter(e => e['o:slug'] === slug)[0];
	if (exhibit) {
		dispatch({type: ACTION_TYPE.EXHIBIT_LOADED, exhibit});
		return fetch(urlFormat(recordsEndpoint, {exhibit_id: exhibit['o:id']})).then(function(response) {
			if (!response.ok) {
				throw Error(response.statusText);
			}
			return response;
		}).then(response => parseRecordsJSON(response)).then(records => dispatch({type: ACTION_TYPE.EXHIBIT_FETCH_SUCCESS, records})).then(() => dispatch({type: ACTION_TYPE.EXHIBIT_LOADING, loading: false})).catch(() => dispatch({type: ACTION_TYPE.EXHIBIT_ERRORED, errored: true}));
	} else {
		dispatch({type: ACTION_TYPE.EXHIBIT_NOT_FOUND});
	}
}

export const fetchExhibitWithRecords = (slug) => {
	return function(dispatch, getState) {
		dispatch({type: ACTION_TYPE.EXHIBIT_LOADING, loading: true});
		const exhibits = getState().exhibits.exhibits;
		if (exhibits && exhibits.length > 0)
			return setExhibitBySlugAndFetchRecords(exhibits, slug, dispatch);
		return fetch(urlFormat(exhibitsEndpoint)).then((response) => {
			if (!response.ok) {
				throw Error(response.statusText);
			}
			return response;
		}).then(response => parseExhibitsJSON(response)).then(exhibits => setExhibitBySlugAndFetchRecords(exhibits, slug, dispatch)).catch(() => dispatch({type: ACTION_TYPE.EXHIBIT_ERRORED, errored: true}));
	};
}

export const selectRecord = (payload) => action(ACTION_TYPE.RECORD_SELECTED, payload);

export const deselectRecord = (payload) => action(ACTION_TYPE.RECORD_DESELECTED, payload);

export const deleteExhibit = (exhibit) => {
	return function(dispatch) {
		if (window.confirm(strings.formatString(strings.exhibit_delete_confirmation, exhibit['o:title']))) {
			dispatch({type: ACTION_TYPE.EXHIBIT_DELETED, exhibit});

			fetch(urlFormat(exhibitsEndpoint, {}, exhibit['o:id']), {method: 'DELETE'}).then(response => {
				if (!response.ok) {
					throw Error(response.statusText);
				}
			}).then(() => dispatch({type: ACTION_TYPE.EXHIBIT_DELETE_SUCCESS})).then(() => dispatch(fetchExhibits())).catch(() => dispatch({type: ACTION_TYPE.EXHIBIT_DELETE_ERRORED}));
		}
	}
}

export const createExhibit = (exhibit) => {
	return function(dispatch) {
		dispatch({type: ACTION_TYPE.EXHIBIT_CREATED, exhibit});

		fetch(urlFormat(exhibitsEndpoint), {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(exhibit)
		}).then(response => {
			if (!response.ok) {
				throw Error(response.statusText);
			}
		}).then(() => dispatch({type: ACTION_TYPE.EXHIBIT_POST_SUCCESS})).then(() => history.push(`${window.baseRoute}/`)).catch(() => dispatch({type: ACTION_TYPE.EXHIBIT_POST_ERRORED}));
	}
}
