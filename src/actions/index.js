import * as types from './action-types';

// Action Helper
function action(type, payload = {}) {
	return {type, payload}
}

// Action dispatchers
export const set_tileLayer = (payload) => action(types.SET_TILELAYER, payload);
export const set_availableTileLayers = (payload) => action(types.SET_AVAILABLE_TILELAYERS, payload);

export const createRecord = (payload) => action(types.RECORD_CREATE, payload);
export const updateRecord = (payload) => action(types.RECORD_UPDATE, payload);
export const deleteRecord = (payload) => action(types.RECORD_DELETE, payload);

export const preview_fillColor = (payload) => action(types.PREVIEW_FILLCOLOR, payload);
