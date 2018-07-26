import { urlFormat, exhibitsEndpoint } from '../../sagas/api_helper.js';
import { fetchExhibits } from './exhibits';
import { replace } from 'react-router-redux'

import * as ACTION_TYPE from '../../actions/action-types';


const initialState = {
  changedExhibit: null,
  loading: false,
  errored: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPE.EXHIBIT_UPDATED:
      return {
        ...state,
        loading: true,
        changedExhibit: action.exhibit
      };

    case ACTION_TYPE.EXHIBIT_PATCH_SUCCESS:
      return {
        ...state,
        loading: false,
        changedExhibit: initialState.changedExhibit
      };

    case ACTION_TYPE.EXHIBIT_PATCH_ERRORED:
      return {
        ...state,
        errored: true
      };

    default:
      return state;
  }
}

export function updateExhibit(exhibit) {
  return function(dispatch) {
    dispatch({
      type: ACTION_TYPE.EXHIBIT_UPDATED,
      exhibit
    });

    fetch(urlFormat(exhibitsEndpoint, {}, exhibit['o:id']), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body: JSON.stringify(exhibit)
    })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
      })
      .then(() => dispatch({
        type: ACTION_TYPE.EXHIBIT_PATCH_SUCCESS
      }))
      .then(() => dispatch({
        type: ACTION_TYPE.EXHIBIT_LOADED,
        exhibit: exhibit
      }))
      .then(() => dispatch(replace(window.baseRoute + '/show/' + exhibit['o:slug'])))
      .then(() => dispatch(fetchExhibits()))
      .catch(() => dispatch({
        type: ACTION_TYPE.EXHIBIT_PATCH_ERRORED
      }));
  }
}
