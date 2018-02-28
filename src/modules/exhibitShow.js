import { urlFormat, recordsEndpoint, exhibitsEndpoint, parseRecordsJSON, parseExhibitsJSON } from './apiHelper';

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

const initialState = {
  records: [],
  exhibit: null,
  loading: false,
  errored: false,
  exhibitNotFound: false,
  selectedRecord: null,
  previewedRecord: null
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
      return {
        ...state,
        exhibit: initialState.exhibit,
        records: initialState.records,
        selectedRecord: initialState.selectedRecord,
        previewedRecord: initialState.previewedRecord
      }

    case EXHIBIT_LOADED:
      return {
        ...state,
        exhibit: action.exhibit,
        exhibitNotFound: false
      }

    case EXHIBIT_NOT_FOUND:
      return {
        ...state,
        exhibitNotFound: true
      }

    case RECORD_SELECTED:
      return {
        ...state,
        selectedRecord: action.record
      }

    case RECORD_DESELECTED:
      return {
        ...state,
        selectedRecord: null
      }

    case RECORD_PREVIEWED:
      return {
        ...state,
        previewedRecord: action.record
      }

    case RECORD_UNPREVIEWED:
      return {
        ...state,
        previewedRecord: null
      }

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
    return fetch(urlFormat(recordsEndpoint, {exhibit_id: exhibit['o:id']}))
      .then(function(response) {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        dispatch({
          type: EXHIBIT_LOADING,
          loading: false
        });

        return response;
      })
      .then(response => parseRecordsJSON(response))
      .then(records => dispatch({
        type: EXHIBIT_FETCH_SUCCESS,
        records
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
  return function (dispatch, getState) {
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
