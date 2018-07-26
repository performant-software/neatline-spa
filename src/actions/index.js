import * as types from './action-types';

// Action Helper
function action(type, payload = {}) {
	return {type, payload}
}

// Action dispatchers
export const preview_baseLayer = (payload) => action(types.PREVIEW_BASELAYER, payload);
export const set_availableTileLayers = (payload) => action(types.SET_AVAILABLE_TILELAYERS, payload);

export const createRecord = (payload) => action(types.RECORD_CREATE, payload);
export const updateRecord = (payload) => action(types.RECORD_UPDATE, payload);
export const deleteRecord = (payload) => action(types.RECORD_DELETE, payload);

export const preview_fillColor = (payload) => action(types.PREVIEW_FILLCOLOR, payload);

export const preview_init = (payload) => action(types.PREVIEW_INIT,payload);
export const preview_update = (payload) => action(types.PREVIEW_UPDATE, payload);
export const preview_markSelected = (payload) => action(types.PREVIEW_MARKSELECTED, payload);

export const setUnsavedChanges = (payload) => action(types.HAS_UNSAVED_CHANGES,payload);
