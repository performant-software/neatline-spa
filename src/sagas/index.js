import {urlFormat, recordsEndpoint, exhibitsEndpoint, parseExhibitsJSON} from './api_helper.js';
import {put, takeLatest, all} from 'redux-saga/effects';
//import { push } from 'react-router-redux';
import {strings} from '../i18nLibrary';


import * as ACTION_TYPE from '../actions/action-types';

const JSON_HEADERS = {
	'Accept': 'application/json',
	'Content-Type': 'application/json'
}

// Export only a single rollup point
export default function* rootSaga() {
	yield all([
		takeLatest(ACTION_TYPE.RECORD_CREATE, createRecord),
		takeLatest(ACTION_TYPE.RECORD_DELETE, deleteRecord),
		takeLatest(ACTION_TYPE.RECORD_UPDATE, updateRecord),
		takeLatest(ACTION_TYPE.CREATE_RECORD_RESPONSE_RECEIVED, createRecordResponseReceived),
		takeLatest(ACTION_TYPE.DELETE_RECORD_RESPONSE_RECEIVED, deleteRecordResponseReceived),
		takeLatest(ACTION_TYPE.UPDATE_RECORD_RESPONSE_RECEIVED, updateRecordResponseReceived),

		takeLatest(ACTION_TYPE.EXHIBIT_CACHE_SAVE, saveCacheToDatabase),
		takeLatest(ACTION_TYPE.EXHIBIT_FETCH, fetchExhibits),
		takeLatest(ACTION_TYPE.EXHIBIT_FETCH_RESPONSE_RECEIVED, fetchExhibitsResponseReceived),

		takeLatest(ACTION_TYPE.EXHIBIT_UPDATE, updateExhibit),
		takeLatest(ACTION_TYPE.EXHIBIT_UPDATE_RESPONSE_RECEIVED, updateExhibitResponseReceived)
	])
}

// Create a record
function* createRecord(action) {
	// Make API call
	try {
		let url = urlFormat(recordsEndpoint);
		const response = yield fetch(url, {
			method: 'POST',
			headers: JSON_HEADERS,
			body: JSON.stringify(action.payload)
		});
		let response_json = yield response.json();
		yield put({type: ACTION_TYPE.CREATE_RECORD_RESPONSE_RECEIVED, payload: response_json});

		// Failed on the fetch call (timeout, etc)
	} catch (e) {
		yield put({
			type: ACTION_TYPE.RECORD_ERROR,
			payload: {
				record: '',
				message: strings.create_record_error,
				error: e
			}
		});
	}
}

function* createRecordResponseReceived(action) {

	// On success...
	if (typeof action.payload.errors === 'undefined') {
		yield put({type: ACTION_TYPE.EDITOR_CLOSE_NEW_RECORD});
		yield put({type: ACTION_TYPE.RECORD_ADDED, record: action.payload});

		// On failure...
	} else {}
}

// Delete a record on confirm
function* deleteRecord(action) {
	let record = action.payload;
	if (window.confirm(strings.formatString(strings.record_delete_confirmation, record['o:title']))) {

		// Make API call
		try {
			const response = yield fetch(urlFormat(recordsEndpoint, {}, record['o:id']), {method: 'DELETE'});
			let response_json = yield response.json();
			let newPayload = {
				jsonResponse: response_json,
				record: action.payload
			}
			yield put({type: ACTION_TYPE.DELETE_RECORD_RESPONSE_RECEIVED, payload: newPayload});

			// Failed on the fetch call (timeout, etc)
		} catch (e) {
			yield put({
				type: ACTION_TYPE.RECORD_ERROR,
				payload: {
					record: record,
					message: strings.delete_record_error,
					error: e
				}
			});
		}
	}

}
function* deleteRecordResponseReceived(action) {
	// On success...
	if (typeof action.payload.jsonResponse.errors === 'undefined') {
		yield put({type: ACTION_TYPE.RECORD_REMOVED, record: action.payload.record});

		// On failure...
	} else {}
}

// Update a record
function* updateRecord(action) {
	//console.log(action.payload);
	let record = action.payload;
	try {
		let url = urlFormat(recordsEndpoint, {}, record['o:id']);
		const response = yield fetch(url, {
			method: 'PATCH',
			headers: JSON_HEADERS,
			body: JSON.stringify(record)
		});
		let response_json = yield response.json();
		yield put({type: ACTION_TYPE.UPDATE_RECORD_RESPONSE_RECEIVED, payload: response_json});

		// Failed on the fetch call (timeout, etc)
	} catch (e) {
		yield put({
			type: ACTION_TYPE.RECORD_ERROR,
			payload: {
				record: record,
				message: strings.update_record_error,
				error: e
			}
		});
	}
}
function* updateRecordResponseReceived(action) {
	// On success...
	if (typeof action.payload.errors === 'undefined') {
		yield put({type: ACTION_TYPE.EDITOR_RECORD_SET});
		yield put({type: ACTION_TYPE.RECORD_REPLACED, record: action.payload});

		// On failure...
	} else {}
}

// Save cache to the database
function* saveCacheToDatabase(action) {
	let records = action.payload.records;
	let exhibit = action.payload.exhibit;

	// Create if there's a new one
	if(typeof action.payload.records[-1] !== 'undefined'){
		let newRecord = action.payload.records[-1];
		yield put({type: ACTION_TYPE.RECORD_CREATE, payload:newRecord});
	}

	yield put({type: ACTION_TYPE.RECORD_CACHE_CLEAR_UNSAVED});

	// Update records
	for (let x = 0; x < records.length; x++) {
		let thisRecord = records[x];
		if (typeof thisRecord !== 'undefined') {
			yield put({type: ACTION_TYPE.RECORD_UPDATE, payload: thisRecord});
		}
	}



	// Save the exhibit
	if (exhibit !== 'undefined') {
		yield put({type: ACTION_TYPE.EXHIBIT_UPDATE, payload:exhibit});
	}
}

function* fetchExhibits(action) {
	try {
		yield put({
			type: ACTION_TYPE.EXHIBITS_LOADING,
			payload: {
				loading: true
			}
		});

		let url = urlFormat(exhibitsEndpoint);
		const response = yield fetch(url);
		yield put({type: ACTION_TYPE.EXHIBIT_FETCH_RESPONSE_RECEIVED, payload: response});

		// Failed on the fetch call (timeout, etc)
	} catch (e) {
		yield put({
			type: ACTION_TYPE.EXHIBITS_LOADING,
			payload: {
				loading: false
			}
		});
		yield put({
			type: ACTION_TYPE.RECORD_ERROR,
			payload: {
				message: 'error',
				error: e
			}
		});
	}
}

function* fetchExhibitsResponseReceived(action) {
	yield put({
		type: ACTION_TYPE.EXHIBITS_LOADING,
		payload: {
			loading: false
		}
	});

	// On success...
	if (typeof action.payload.errors === 'undefined') {
		let exhibits = yield parseExhibitsJSON(action.payload);
		yield put({type: ACTION_TYPE.EXHIBITS_FETCH_SUCCESS, payload: exhibits})

	// On failure...
	} else {
		yield put({
			type: ACTION_TYPE.RECORD_ERROR,
			payload: {
				message: 'error'
			}
		});
	}
}

function* updateExhibit(action) {
	try {
		let exhibit = action.payload;
		let url = urlFormat(exhibitsEndpoint, {}, exhibit['o:id']);
		const response = yield fetch(url, {
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	      },
	      method: 'PATCH',
	      body: JSON.stringify(exhibit)
	    });
		yield put({type: ACTION_TYPE.EXHIBIT_UPDATE_RESPONSE_RECEIVED, payload:{response:response,exhibit:exhibit}});


	} catch (e) {
		yield put({
			type: ACTION_TYPE.RECORD_ERROR,
			payload: {
				error: e
			}
		});
	}
}
function* updateExhibitResponseReceived(action) {
	let exhibit = action.payload.exhibit;
	if (typeof action.payload.errors === 'undefined') {
		yield put({type: ACTION_TYPE.EXHIBIT_PATCH_SUCCESS});
		yield put({type: ACTION_TYPE.EXHIBIT_LOADED, exhibit: exhibit});
		yield put({type:ACTION_TYPE.EXHIBIT_FETCH});
	}else{
		yield put({type: ACTION_TYPE.EXHIBIT_PATCH_ERRORED});
		throw Error(action.payload.response.statusText);
	}
}
