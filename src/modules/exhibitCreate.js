import { urlFormat, exhibitsEndpoint } from './apiHelper';
import { push } from 'react-router-redux';

export const EXHIBIT_CREATED = 'exhibitCreate/EXHIBIT_CREATED';
export const EXHIBIT_POST_SUCCESS = 'exhibitCreate/EXHIBIT_POST_SUCCESS';
export const EXHIBIT_POST_ERRORED = 'exhibitCreate/EXHIBIT_POST_ERRORED';
export const NEW_EXHIBIT_RESET = 'exhibitCreate/NEW_EXHIBIT_RESET';

const initialState = {
  newExhbit: null,
  loading: false,
  errored: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case EXHIBIT_CREATED:
      return {
        ...state,
        loading: true,
        newExhbit: action.exhibit
      };

    case EXHIBIT_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        newExhibit: initialState.newExhbit
      };

    case EXHIBIT_POST_ERRORED:
      return {
        ...state,
        errored: true
      };

    case NEW_EXHIBIT_RESET:
      return initialState;

    default:
      return state;
  }
}

export function createExhibit(exhibit) {
  return function(dispatch) {
    dispatch({
      type: EXHIBIT_CREATED,
      exhibit
    });

    fetch(urlFormat(exhibitsEndpoint), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(exhibit)
    })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
      })
      .then(() => dispatch({
        type: EXHIBIT_POST_SUCCESS
      }))
      .then(() => dispatch(push(`${window.baseRoute}/`)))
      .catch(() => dispatch({
        type: EXHIBIT_POST_ERRORED
      }));
  }
}
