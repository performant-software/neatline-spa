// All of the actions live here...
// if this gets unweildy, it can be split into multiple files

// Map preview
export const PREVIEW_FILLCOLOR = 'PREVIEW_FILLCOLOR';
export const PREVIEW_BASELAYER = 'PREVIEW_BASELAYER';
export const SET_AVAILABLE_TILELAYERS = 'SET_AVAILABLE_TILELAYERS';
export const PREVIEW_INIT = 'PREVIEW_INIT';
export const PREVIEW_UPDATE = 'PREVIEW_UPDATE';
export const PREVIEW_UPDATE_BULK = 'PREVIEW_UPDATE_BULK';
export const PREVIEW_MARKSELECTED = 'PREVIEW_MARKSELECTED';

// Exhibits
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
export const RECORD_COVERAGE_SET = 'exhibitShow/RECORD_COVERAGE_SET';

// Records
export const RECORD_ERROR = 'RECORD_ERROR';
export const NEW_RECORD_RESET = 'recordCreate/NEW_RECORD_RESET';

export const RECORD_CREATE = 'recordCreate/RECORD_CREATE'
export const CREATE_RECORD_RESPONSE_RECEIVED = 'CREATE_RECORD_RESPONSE_RECEIVED';

export const RECORD_DELETE = 'recordDelete/RECORD_DELETE';
export const DELETE_RECORD_RESPONSE_RECEIVED = 'DELETE_RECORD_RESPONSE_RECEIVED';

export const RECORD_UPDATE = 'recordUpdate/RECORD_UPDATE';
export const UPDATE_RECORD_RESPONSE_RECEIVED = 'UPDATE_RECORD_RESPONSE_RECEIVED';

export const EXHIBIT_UPDATED = 'exhibitUpdate/EXHIBIT_CREATED';
export const EXHIBIT_PATCH_SUCCESS = 'exhibitUpdate/EXHIBIT_POST_SUCCESS';
export const EXHIBIT_PATCH_ERRORED = 'exhibitUpdate/EXHIBIT_POST_ERRORED';
