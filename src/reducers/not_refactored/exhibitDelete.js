import { urlFormat, exhibitsEndpoint } from '../../sagas/api_helper.js';
import {fetchExhibits} from '../../actions';
import {strings} from '../../i18nLibrary';

export const EXHIBIT_DELETED = 'exhibitDelete/EXHIBIT_DELETED';
export const EXHIBIT_DELETE_SUCCESS = 'exhibitDelete/EXHIBIT_DELETE_SUCCESS';
export const EXHIBIT_DELETE_ERRORED = 'exhibitDelete/EXHIBIT_DELETE_ERRORED';

const initialState = {
  loading: false,
  errored: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case EXHIBIT_DELETED:
      return {
        ...state,
        loading: true
      };

    case EXHIBIT_DELETE_SUCCESS:
      return {
        ...state,
        loading: false
      };

    case EXHIBIT_DELETE_ERRORED:
      return {
        ...state,
        errored: true
      };

    default:
      return state;
  }
}

export function deleteExhibit(exhibit) {
  return function(dispatch) {
    if (window.confirm( strings.formatString(strings.exhibit_delete_confirmation, exhibit['o:title']) )) {
      dispatch({
        type: EXHIBIT_DELETED,
        exhibit
      });

      fetch(urlFormat(exhibitsEndpoint, {}, exhibit['o:id']), {
        method: 'DELETE'
      })
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
        })
        .then(() => dispatch({
          type: EXHIBIT_DELETE_SUCCESS
        }))
        .then(() => dispatch(fetchExhibits()))
        .catch(() => dispatch({
          type: EXHIBIT_DELETE_ERRORED
        }));
    }
  }
}
