import initialState from './exhibitCreate-initialState';
import {urlFormat, exhibitsEndpoint} from '../../sagas/api_helper.js';
import history from '../../history';
import * as ACTION_TYPE from '../../actions/action-types';

export default function(state = initialState, action) {
	switch (action.type) {
		case ACTION_TYPE.EXHIBIT_CREATED:
			return {
				...state,
				loading: true,
				newExhibit: action.exhibit
			};

		case ACTION_TYPE.EXHIBIT_POST_SUCCESS:
			return {
				...state,
				loading: false,
				newExhibit: initialState.newExhibit
			};

		case ACTION_TYPE.EXHIBIT_POST_ERRORED:
			return {
				...state,
				errored: true
			};

		case ACTION_TYPE.NEW_EXHIBIT_RESET:
			return initialState;

		default:
			return state;
	}
}
