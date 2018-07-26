import { urlFormat, recordsEndpoint } from './api_helper.js';
import {put,takeLatest,all} from 'redux-saga/effects';
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
		takeLatest(ACTION_TYPE.UPDATE_RECORD_RESPONSE_RECEIVED, updateRecordResponseReceived)
	])
}

// Create a record
function* createRecord(action) {
	// Make API call
	try{
		let url = urlFormat(recordsEndpoint);
		const response = yield fetch(url,{
							method: 'POST',
							headers: JSON_HEADERS,
							body: JSON.stringify(action.payload)});
		let response_json = yield response.json();
		yield put({type: ACTION_TYPE.CREATE_RECORD_RESPONSE_RECEIVED, payload:response_json});

	// Failed on the fetch call (timeout, etc)
    }catch(e) {
		yield put({	type: ACTION_TYPE.RECORD_ERROR,
					payload: {
						record:'',
						message: strings.create_record_error,
						error:e
					}});
    }
}

function* createRecordResponseReceived(action){

	// On success...
	if (typeof action.payload.errors === 'undefined') {
		 yield put({type: ACTION_TYPE.EDITOR_CLOSE_NEW_RECORD});
		 yield put({type: ACTION_TYPE.RECORD_ADDED,record: action.payload});

	// On failure...
	}else{
	}
}

// Delete a record on confirm
function* deleteRecord(action) {
	let record = action.payload;
	if (window.confirm(  strings.formatString(strings.record_delete_confirmation, record['o:title']) )) {

		// Make API call
		try{
			const response = yield fetch(urlFormat(recordsEndpoint, {}, record['o:id']),{method: 'DELETE'});
			let response_json = yield response.json();
			let newPayload={
				jsonResponse:response_json,
				record:action.payload
			}
			yield put({type: ACTION_TYPE.DELETE_RECORD_RESPONSE_RECEIVED, payload:newPayload});


		// Failed on the fetch call (timeout, etc)
		}catch(e) {
			yield put({	type: ACTION_TYPE.RECORD_ERROR,
						payload: {
							record:record,
							message:strings.delete_record_error,
							error:e
						}});
		}
	}

}
function* deleteRecordResponseReceived(action){
	// On success...
	if (typeof action.payload.jsonResponse.errors === 'undefined') {
		 yield put({type: ACTION_TYPE.RECORD_REMOVED,record: action.payload.record});

	// On failure...
	}else{
	}
}

// Update a record
function* updateRecord(action) {
	let record = action.payload;
	try{
		let url = urlFormat(recordsEndpoint, {}, record['o:id']);
		const response = yield fetch(url,{
							method: 'PATCH',
							headers: JSON_HEADERS,
							body: JSON.stringify(record)});
		let response_json = yield response.json();
		yield put({type: ACTION_TYPE.UPDATE_RECORD_RESPONSE_RECEIVED, payload:response_json});

	// Failed on the fetch call (timeout, etc)
	}catch(e) {
		yield put({	type: ACTION_TYPE.RECORD_ERROR,
					payload: {
						record:record,
						message:strings.update_record_error,
						error:e
					}});

    }
}
function* updateRecordResponseReceived(action){

	// On success...
	if (typeof action.payload.errors === 'undefined') {
		yield put({type: ACTION_TYPE.EDITOR_RECORD_SET});
		yield put({type: ACTION_TYPE.RECORD_REPLACED,record: action.payload});

	// On failure...
	}else{
	}
}
