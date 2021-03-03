import * as ACTION_TYPE from '../actions/action-types';
import {urlFormat, recordsEndpoint, exhibitsEndpoint, parseRecordsJSON,parseExhibitsJSON} from './api_helper.js';
import {put, takeEvery, takeLatest, all, select} from 'redux-saga/effects';
import session from '../services/session';
import {strings} from '../i18nLibrary';
import history from '../history';
const JSON_HEADERS = {
	'Accept': 'application/json',
	'Content-Type': 'application/json'
}

export const getExhibits = (state) => state.exhibits.exhibits;
export const getExhibitCache = (state) => state.exhibitCache.cache;
export const getMapCache = (state) => state.mapCache.cache;
export const getSelectedRecord = (state) => state.exhibitShow.selectedRecord;
export const getRecords = (state) => state.exhibitShow.records;

export default function* rootSaga() {
	yield all([
		takeLatest(ACTION_TYPE.RECORD_CREATE, createRecord),
		takeLatest(ACTION_TYPE.CREATE_RECORD_RESPONSE_RECEIVED, createRecordResponseReceived),

		takeLatest(ACTION_TYPE.RECORD_DELETE, deleteRecord),
		takeLatest(ACTION_TYPE.DELETE_RECORD_RESPONSE_RECEIVED, deleteRecordResponseReceived),

		takeLatest(ACTION_TYPE.RECORD_UPDATE, updateRecord),
		takeLatest(ACTION_TYPE.UPDATE_RECORD_RESPONSE_RECEIVED, updateRecordResponseReceived),


		takeLatest(ACTION_TYPE.EXHIBIT_FETCH, fetchExhibits),
		takeLatest(ACTION_TYPE.EXHIBIT_FETCH_RESPONSE_RECEIVED, fetchExhibitsResponseReceived),


		takeLatest(ACTION_TYPE.RECORDS_FETCH, fetchRecords),
		takeLatest(ACTION_TYPE.RECORDS_FETCH_RESPONSE_RECEIVED, fetchRecordsResponseReceived),
		// takeLatest(ACTION_TYPE.RECORDS_FILTER, filterRecords),


		takeLatest(ACTION_TYPE.RECORD_FETCH_BY_SLUG, fetchRecordsBySlug),
		takeLatest(ACTION_TYPE.EXHIBIT_UPDATE, updateExhibit),
		takeLatest(ACTION_TYPE.EXHIBIT_UPDATE_RESPONSE_RECEIVED, updateExhibitResponseReceived),

		takeLatest(ACTION_TYPE.RECORD_SELECTED, selectRecord),
		takeLatest(ACTION_TYPE.RECORD_DESELECTED, deselectRecord),

		takeLatest(ACTION_TYPE.RECORD_CACHE_UPDATE_AND_SAVE, updateRecordCacheAndSave),
		takeLatest(ACTION_TYPE.EXHIBIT_CACHE_SAVE, saveCacheToDatabase),

		takeLatest(ACTION_TYPE.EVENT_REFRESH_MAP, requestMapRefresh),

    takeLatest(ACTION_TYPE.USER_LOGIN, userLogin),
    takeLatest(ACTION_TYPE.USER_LOGIN_SUCCESS, userLoginSuccess),

    takeLatest(ACTION_TYPE.USER_LOGOUT, userLogout),
    takeLatest(ACTION_TYPE.USER_LOGOUT_SUCCESS, userLogoutSuccess),

    takeLatest(ACTION_TYPE.MAP_FETCH, fetchMap),
    takeLatest(ACTION_TYPE.MAP_RECORDS_FETCH, fetchMapRecords)

    // commenting out for now as HAS_UNSAVED_CHANGES fires frequently during editing and doesn't appear to require a map refresh in most cases (akstuhl)
		// takeLatest(ACTION_TYPE.HAS_UNSAVED_CHANGES, requestMapRefresh)
	])
}


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

function* selectRecord(action) {
  const { redirect } = (action.payload || {});
  if (redirect) {
    let exhibit = yield select(getExhibitCache);
    let slug = exhibit['o:slug'];
    let url = (typeof window.baseRoute !== 'undefined')?`${window.baseRoute}`:"";
    url += `/show/${slug}/edit/${action.payload.record['o:id']}`;
    history.replace(url);
  }
}

function* deselectRecord(action) {
  const { redirect } = (action.payload || {});
  if (redirect) {
    let exhibit = yield select(getExhibitCache);
    let slug = exhibit['o:slug'];
    let url = (typeof window.baseRoute !== 'undefined') ? `${ window.baseRoute }` : "";
    url += `/show/${ slug }`;
    history.replace(url);
  }
  yield put({type: ACTION_TYPE.EVENT_REFRESH_MAP_GEOMETRY});
}

function* createRecordResponseReceived(action) {
	// On success...
	if (typeof action.payload.errors === 'undefined') {
		yield put({type: ACTION_TYPE.RECORD_CACHE_UPDATE, payload:{
			setValues:{
				'o:id': action.payload['o:id'],
				'o:coverage': action.payload['o:coverage'],
				'o:is_coverage': action.payload['o:is_coverage'],
				'o:fill_color': 'FF00FF'
			}}
		});
		yield put({type: ACTION_TYPE.EDITOR_CLOSE_NEW_RECORD});
		yield put({type: ACTION_TYPE.RECORD_ADDED, record:action.payload});
		yield put({type: ACTION_TYPE.RECORD_SELECTED, payload:{record:action.payload}});


	// On failure...
	} else {
    console.log('!! failure response received for createRecord');
  }
}

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
		yield put({type: ACTION_TYPE.RECORD_CACHE_REMOVE_BY_ID, payload:action.payload.record['o:id']});

	}
	yield put({type: ACTION_TYPE.RECORD_DESELECTED});
}

function* updateRecord(action) {
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
		yield put({type: ACTION_TYPE.RECORD_REPLACED, record: action.payload});
	}

  // commenting out for now -- what is deselection intended to accomplish here? (akstuhl)
	// yield put({type: ACTION_TYPE.RECORD_DESELECTED});

	yield put({type: ACTION_TYPE.LEAFLET_IS_EDITING, payload: false});
}

function requestMapRefresh(action){
	var event = new CustomEvent("refreshMap");
	document.dispatchEvent(event);
}

function* fetchExhibits(action) {
	try {
		yield put({type: ACTION_TYPE.EXHIBITS_LOADING,payload: {loading: true}});
		let url = urlFormat(exhibitsEndpoint);
		const response = yield fetch(url);
		yield put({type: ACTION_TYPE.EXHIBIT_FETCH_RESPONSE_RECEIVED, payload: {response:response}});

	// Failed on the fetch call (timeout, etc)
	} catch (e) {
    console.log(e);
		yield put({type: ACTION_TYPE.EXHIBITS_LOADING,payload: {loading: false}});
		yield put({type: ACTION_TYPE.EXHIBITS_ERRORED, payload: e});
	}
}

function* fetchExhibitsResponseReceived(action) {
	yield put({type: ACTION_TYPE.EXHIBITS_LOADING, payload: {loading: false}});

	// On success...
	if (action.payload.response.status === 200) {
		let exhibits = yield parseExhibitsJSON(action.payload.response);
		yield put({type: ACTION_TYPE.EXHIBITS_FETCH_SUCCESS, payload:exhibits});

	// On failure...
	} else {
		yield put({type: ACTION_TYPE.EXHIBITS_ERRORED, payload: action.payload.response});
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
		yield put({
			type: ACTION_TYPE.EXHIBIT_UPDATE_RESPONSE_RECEIVED,
			payload: {
				response: response,
				exhibit: exhibit
			}
		});

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
		yield put({type: ACTION_TYPE.EXHIBIT_LOADED, payload: exhibit});
		yield put({type: ACTION_TYPE.EXHIBIT_FETCH});
	} else {
		yield put({type: ACTION_TYPE.EXHIBIT_PATCH_ERRORED});
		throw Error(action.payload.response.statusText);
	}
}

function* fetchRecordsBySlug(action) {
	let slug = action.payload;
	let exhibits = yield select(getExhibits);
	if (exhibits && exhibits.length > 0) {
		let exhibit = exhibits.filter(e => e['o:slug'] === slug)[0];
		yield put({ type: ACTION_TYPE.RECORDS_LOADING, payload: true});
		yield put({type: ACTION_TYPE.EXHIBIT_LOADED, payload: exhibit});
		yield put({type: ACTION_TYPE.EXHIBIT_CACHE_UPDATE, payload:{setValues:exhibit}});
		yield put({type: ACTION_TYPE.RECORDS_FETCH, payload: exhibit});

		// FIXME: this could be a lot more efficient, an it's not great to
		// unpack the type like this
		let baselayerType="MAP";
		switch (exhibit['o:exhibit_type']) {
			case 1:
				baselayerType="IMAGE";
				break;
			case 2:
				baselayerType="WMS";
				break;
			case 3:
				baselayerType="TILE";
				break;
			default:
		}
		yield put({ type: ACTION_TYPE.PREVIEW_BASELAYER,
					payload:{
						id: exhibit['o:exhibit_type'],
						image_address: exhibit['o:image_layer'],
						image_attribution: exhibit['o:image_attribution'],
						image_layer:  exhibit['o:image_layer'],
						tile_address: exhibit['o:tile_address'],
						tile_attribution: exhibit['o:tile_attribution'],
						type: baselayerType,
						wms_address: exhibit['o:wms_address'],
						wms_attribution: exhibit['o:wms_attribution'],
						wms_layers: exhibit['o:wms_layers']
					}});


	}
}


function* fetchRecords(action) {
	yield put({ type: ACTION_TYPE.RECORDS_LOADING, payload: true});

	try {
		let url = urlFormat(recordsEndpoint, {exhibit_id: action.payload['o:id']});
		const response = yield fetch(url);
		yield put({type: ACTION_TYPE.RECORDS_FETCH_RESPONSE_RECEIVED, payload: {response:response}});

	// Failed on the fetch call (timeout, etc)
	} catch (e) {
		//yield put({type: ACTION_TYPE.RECORDS_LOADING,payload: {loading: false}});
		yield put({ type: ACTION_TYPE.RECORD_ERROR, payload: {message: 'error',error: e}});
	}

}

function* fetchRecordsResponseReceived(action) {
	if (typeof action.payload.errors === 'undefined') {
		let records = yield parseRecordsJSON(action.payload.response);
		yield put({type: ACTION_TYPE.RECORD_CACHE_UPDATE, payload:records});
		yield put({type: ACTION_TYPE.RECORDS_FETCH_SUCCESS, payload:records});
		yield put({ type: ACTION_TYPE.RECORDS_FILTER, payload: records })

	} else {
		yield put({type: ACTION_TYPE.RECORD_ERROR});
		throw Error(action.payload.response.statusText);
	}
}

// function* filterRecords(action) {
// 	yield put({ type: ACTION_TYPE.RECORDS_FILTER, payload: action.payload });
// }



function* updateRecordCacheAndSave(action) {
	yield put({type: ACTION_TYPE.RECORD_CACHE_UPDATE, payload:action.payload});
	yield put({type: ACTION_TYPE.EXHIBIT_CACHE_SAVE, payload:action.payload});
}

function* saveCacheToDatabase(action) {
	yield put({type: ACTION_TYPE.LEAFLET_IS_SAVING, payload: true});

	let exhibit = yield select(getExhibitCache);
	let records = yield select(getMapCache);
	let selectedRecord = action.payload.selectedRecord;
	let isNewRecord=false;

	// Create if there's a new one
	if (typeof records[-1] !== 'undefined') {
		isNewRecord=true;
		let newRecord = records[-1];
		if(newRecord["o:exhibit"] !== 'undefined'){
			yield put({type: ACTION_TYPE.RECORD_CREATE, payload: newRecord});
		}
	}

	// Clear temp cache item
	yield put({type: ACTION_TYPE.RECORD_CACHE_CLEAR_UNSAVED});


  // FIXME: TO BE RESOLVED - this was causing all kinds of trouble because all records get updated every time anything happens, and then between the saga/takeLatest flow and the reducer's assingment of the response object to exhibitShow.editorRecord, the record selection would change counterintuitively; all that said, I guess we want to be able to do something like this in theory, so maybe the problem should be fixed in the response handler (reducer) stage
	// Update records
	for (let x=0; x<records.length; x++) {
		let thisRecord = records[x];
		if (typeof thisRecord !== 'undefined') {
			yield put({type: ACTION_TYPE.RECORD_UPDATE, payload: thisRecord});
		}
	}

	// Save the exhibit
	if (typeof exhibit !== 'undefined') {
		yield put({type: ACTION_TYPE.EXHIBIT_UPDATE, payload: exhibit});
	}

  // why do we deselect then select here?
	if(typeof selectedRecord !== 'undefined' && selectedRecord !== null && !isNewRecord){
		yield put({type: ACTION_TYPE.RECORD_DESELECTED});
		yield put({type: ACTION_TYPE.RECORD_SELECTED, payload:{record:selectedRecord}});
	}

	yield put({type: ACTION_TYPE.RECORDS_FETCH, payload: exhibit});

	yield put({type: ACTION_TYPE.LEAFLET_IS_SAVING, payload: false});

}

function * userLogin(action) {
  // Make API call
  try {
    let url = urlFormat('login');
    const response = yield fetch(url, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(action.payload)
    });

    if (response.status === 200) {
      let payload = yield response.json();

      yield put({
        type: ACTION_TYPE.USER_LOGIN_SUCCESS,
        payload
      });
    } else {
      yield put({
        type: ACTION_TYPE.USER_LOGIN_ERRORED
      });
    }

    // Failed on the fetch call (timeout, etc)
  } catch (e) {
    yield put({
      type: ACTION_TYPE.USER_LOGIN_ERRORED,
      payload: {
        error: e
      }
    });
  }
}

function userLoginSuccess(action) {
  const user = action.payload;
  session.create(user['o:token']);
  history.replace('/');
}

function * userLogout(action) {
  // Make API call
  try {
    let url = urlFormat('logout');
    const response = yield fetch(url, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(action.payload)
    });

    let payload = yield response.json();

    yield put({
      type: ACTION_TYPE.USER_LOGOUT_SUCCESS,
      payload
    });
  } catch (e) {
    yield put({
      type: ACTION_TYPE.USER_LOGOUT_ERRORED,
      payload: {
        error: e
      }
    });
  }
}

function userLogoutSuccess(action) {
  session.destroy();
  history.replace('/login');
}

function * fetchMap(action) {
  const id = action.payload;

  try {
    const url = urlFormat(exhibitsEndpoint, {}, id);
    const response = yield fetch(url);
    const payload = yield response.json();

    yield put({
      type: ACTION_TYPE.MAP_FETCH_SUCCESS,
      payload
    });

    yield put({
      type: ACTION_TYPE.MAP_RECORDS_FETCH,
      payload
    });
  } catch (e) {
    yield put({
      type: ACTION_TYPE.MAP_FETCH_ERROR,
      error: e
    });
  }
}

function * fetchMapRecords(action) {
  try {
    const url = urlFormat(recordsEndpoint, { exhibit_id: action.payload['o:id'] });
    const response = yield fetch(url);
    const payload = yield parseRecordsJSON(response);

    yield put({
      type: ACTION_TYPE.MAP_RECORDS_FETCH_SUCCESS,
      payload
    });

    yield put({
      type: ACTION_TYPE.RECORD_CACHE_UPDATE,
      payload
    });

    yield put({
      type: ACTION_TYPE.RECORDS_FILTER,
      payload
    });
  } catch (e) {
    yield put({
      type: ACTION_TYPE.MAP_RECORDS_FETCH_ERROR,
      error: e
    });
  }
}