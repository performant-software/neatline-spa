import { urlFormat, recordsEndpoint } from './apiHelper';
import { RECORD_REMOVED, unsetEditorRecord } from './exhibitShow';

export const RECORD_DELETED = 'recordDelete/RECORD_DELETED';
export const RECORD_DELETE_SUCCESS = 'recordDelete/RECORD_DELETE_SUCCESS';
export const RECORD_DELETE_ERRORED = 'recordDelete/RECORD_DELETE_ERRORED';

const initialState = {
  loading: false,
  errored: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RECORD_DELETED:
      return {
        ...state,
        loading: true
      };

    case RECORD_DELETE_SUCCESS:
      return {
        ...state,
        loading: false
      };

    case RECORD_DELETE_ERRORED:
      return {
        ...state,
        errored: true
      };

    default:
      return state;
  }
}

export function deleteRecord(record) {
  return function(dispatch) {
    if (window.confirm(`Are you sure you want to delete the Neatline record "${record['o:title']}"?`)) {
      dispatch({
        type: RECORD_DELETED,
        record
      });

      fetch(urlFormat(recordsEndpoint, {}, record['o:id']), {
        method: 'DELETE'
      })
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
        })
        .then(() => dispatch({
          type: RECORD_DELETE_SUCCESS
        }))
        .then(() => dispatch({
          type: RECORD_REMOVED,
          record
        }))
        .then(() => dispatch(unsetEditorRecord()))
        .catch(() => dispatch({
          type: RECORD_DELETE_ERRORED
        }));
    }
  }
}
