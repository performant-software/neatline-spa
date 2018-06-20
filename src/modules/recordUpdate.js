import { urlFormat, recordsEndpoint, parseRecordJSON } from './apiHelper';
import { EDITOR_RECORD_SET, RECORD_REPLACED } from './exhibitShow';

export const RECORD_UPDATED = 'recordUpdate/RECORD_CREATED';
export const RECORD_PATCH_SUCCESS = 'recordUpdate/RECORD_POST_SUCCESS';
export const RECORD_PATCH_ERRORED = 'recordUpdate/RECORD_POST_ERRORED';

const initialState = {
  changedRecord: null,
  loading: false,
  errored: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RECORD_UPDATED:
      return {
        ...state,
        loading: true,
        changedRecord: action.record
      };

    case RECORD_PATCH_SUCCESS:
      return {
        ...state,
        loading: false,
        changedRecord: initialState.changedRecord
      };

    case RECORD_PATCH_ERRORED:
      return {
        ...state,
        errored: true
      };

    default:
      return state;
  }
}

export function updateRecord(record) {
  console.log(record);
  return function(dispatch) {
    dispatch({
      type: RECORD_UPDATED,
      record
    });

    fetch(urlFormat(recordsEndpoint, {}, record['o:id']), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body: JSON.stringify(record)
    })
      .then((response, error) => {
        if (!response.ok) {
          console.log(error);
          throw Error(response.statusText);
        }
        return response;
      })
      .then(response => parseRecordJSON(response))
      .then(record => {
        dispatch({
          type: RECORD_REPLACED,
          record
        });
        return record;
      })
      .then(record => {
        dispatch({
          type: EDITOR_RECORD_SET,
          record
        })
      })
      .then(() => dispatch({
        type: RECORD_PATCH_SUCCESS
      }))
      .catch(() => dispatch({
        type: RECORD_PATCH_ERRORED
      }));
  }
}
