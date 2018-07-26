import * as ACTION_TYPE from './action-types';

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

export const preview_fillColor = (payload) => action(ACTION_TYPE.PREVIEW_FILLCOLOR, payload);

export const preview_init = (payload) => action(ACTION_TYPE.PREVIEW_INIT,payload);
export const preview_update = (payload) => action(ACTION_TYPE.PREVIEW_UPDATE, payload);
export const preview_markSelected = (payload) => action(ACTION_TYPE.PREVIEW_MARKSELECTED, payload);

export const setUnsavedChanges = (payload) => action(ACTION_TYPE.HAS_UNSAVED_CHANGES,payload);
