import { urlFormat, exhibitsEndpoint } from './apiHelper';
import { fetchExhibits } from './exhibits';
import { EXHIBIT_LOADED } from './exhibitShow';
import { replace } from 'react-router-redux'

export const EXHIBIT_UPDATED = 'exhibitUpdate/EXHIBIT_CREATED';
export const EXHIBIT_PATCH_SUCCESS = 'exhibitUpdate/EXHIBIT_POST_SUCCESS';
export const EXHIBIT_PATCH_ERRORED = 'exhibitUpdate/EXHIBIT_POST_ERRORED';

const initialState = {
  changedExhibit: null,
  loading: false,
  errored: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case EXHIBIT_UPDATED:
      return {
        ...state,
        loading: true,
        changedExhibit: action.exhibit
      };

    case EXHIBIT_PATCH_SUCCESS:
      return {
        ...state,
        loading: false,
        changedExhibit: initialState.changedExhibit
      };

    case EXHIBIT_PATCH_ERRORED:
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
      type: EXHIBIT_UPDATED,
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
        type: EXHIBIT_PATCH_SUCCESS
      }))
      .then(() => dispatch({
        type: EXHIBIT_LOADED,
        exhibit: exhibit
      }))
      .then(() => dispatch(replace(window.baseRoute + '/show/' + exhibit['o:slug'])))
      .then(() => dispatch(fetchExhibits()))
      .catch(() => dispatch({
        type: EXHIBIT_PATCH_ERRORED
      }));
  }
}
