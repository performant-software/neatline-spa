import { urlFormat, recordsEndpoint, parseRecordJSON } from './apiHelper';
import { push } from 'react-router-redux';
import { EDITOR_CLOSE_NEW_RECORD, RECORD_ADDED } from './exhibitShow';

export const RECORD_CREATED = 'recordCreate/RECORD_CREATED';
export const RECORD_POST_SUCCESS = 'recordCreate/RECORD_POST_SUCCESS';
export const RECORD_POST_ERRORED = 'recordCreate/RECORD_POST_ERRORED';
export const NEW_RECORD_RESET = 'recordCreate/NEW_RECORD_RESET';

const initialState = {
  newRecord: null,
  loading: false,
  errored: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RECORD_CREATED:
      return {
        ...state,
        loading: true,
        newRecord: action.record
      };

    case RECORD_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        newRecord: initialState.newRecord
      };

    case RECORD_POST_ERRORED:
      return {
        ...state,
        errored: true
      };

    case NEW_RECORD_RESET:
      return initialState;

    default:
      return state;
  }
}

export function createRecord(record) {
  return function(dispatch, getState) {
    dispatch({
      type: RECORD_CREATED,
      record
    });

    fetch(urlFormat(recordsEndpoint), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(record)
    })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(response => parseRecordJSON(response))
      .then(createdRecord => {
        dispatch({
          type: EDITOR_CLOSE_NEW_RECORD
        });
        return createdRecord;
      })
      .then(createdRecord => {
        dispatch({
          type: RECORD_ADDED,
          record: createdRecord
        });
        return createdRecord;
      })
      .then(createdRecord => dispatch(push(`${window.baseRoute}/show/${getState().exhibitShow.exhibit['o:slug']}/edit/${createdRecord['o:id']}`)))
      .then(() => dispatch({
        type: RECORD_POST_SUCCESS
      }))
      .catch(() => dispatch({
        type: RECORD_POST_ERRORED
      }));
  }
}
