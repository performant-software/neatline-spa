import { urlFormat, recordsEndpoint } from './api_helper.js';
import {put,takeLatest,all} from 'redux-saga/effects';
//import { push } from 'react-router-redux';
import * as actions from '../actions/action-types';
import {strings} from '../i18nLibrary';

const JSON_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

// Export only a single rollup point
export default function* rootSaga() {
	yield all([
		takeLatest(actions.RECORD_CREATE, createRecord),
		takeLatest(actions.RECORD_DELETE, deleteRecord),
		takeLatest(actions.RECORD_UPDATE, updateRecord),
		takeLatest(actions.CREATE_RECORD_RESPONSE_RECEIVED, createRecordResponseReceived),
		takeLatest(actions.DELETE_RECORD_RESPONSE_RECEIVED, deleteRecordResponseReceived),
		takeLatest(actions.UPDATE_RECORD_RESPONSE_RECEIVED, updateRecordResponseReceived)
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
		yield put({type: actions.CREATE_RECORD_RESPONSE_RECEIVED, payload:response_json});

	// Failed on the fetch call (timeout, etc)
    }catch(e) {
		yield put({	type: actions.RECORD_ERROR,
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
		 yield put({type: actions.EDITOR_CLOSE_NEW_RECORD});
		 yield put({type: actions.RECORD_ADDED,record: action.payload});

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
			yield put({type: actions.DELETE_RECORD_RESPONSE_RECEIVED, payload:newPayload});


		// Failed on the fetch call (timeout, etc)
		}catch(e) {
			yield put({	type: actions.RECORD_ERROR,
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
		 yield put({type: actions.RECORD_REMOVED,record: action.payload.record});

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
		yield put({type: actions.UPDATE_RECORD_RESPONSE_RECEIVED, payload:response_json});

	// Failed on the fetch call (timeout, etc)
	}catch(e) {
		yield put({	type: actions.RECORD_ERROR,
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
		yield put({type: actions.EDITOR_RECORD_SET});
		yield put({type: actions.RECORD_REPLACED,record: action.payload});

	// On failure...
	}else{
	}
}
