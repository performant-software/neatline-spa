import { urlFormat, exhibitsEndpoint, parseExhibitsJSON } from '../../sagas/api_helper.js'

export const EXHIBITS_LOADING = 'exhibits/EXHIBITS_LOADING';
export const EXHIBITS_ERRORED = 'exhibits/EXHIBITS_ERRORED';
export const EXHIBITS_FETCH_SUCCESS = 'exhibits/EXHIBITS_FETCH_SUCCESS';

const initialState = {
  exhibits: [],
  loading: false,
  errored: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case EXHIBITS_LOADING:
      return {
        ...state,
        loading: action.loading
      };

    case EXHIBITS_ERRORED:
      return {
        ...state,
        errored: action.errored
      };

    case EXHIBITS_FETCH_SUCCESS:
      return {
        ...state,
        exhibits: action.exhibits
      };

    default:
      return state;
  }
}

export const fetchExhibits = () => {
  return dispatch => {
    dispatch({
      type: EXHIBITS_LOADING,
      loading: true
    });

    fetch(urlFormat(exhibitsEndpoint))
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        dispatch({
          type: EXHIBITS_LOADING,
          loading: false
        });

        return response;
      })
      .then(response => parseExhibitsJSON(response))
      .then(exhibits => dispatch({
        type: EXHIBITS_FETCH_SUCCESS,
        exhibits
      }))
      .catch(() => dispatch({
        type: EXHIBITS_ERRORED,
        errored: true
      }));
  };
}
