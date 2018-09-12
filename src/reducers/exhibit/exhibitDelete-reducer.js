import initialState from './exhibitDelete-initialState';
import {urlFormat, exhibitsEndpoint} from '../../sagas/api_helper.js';
import {fetchExhibits} from '../../actions';
import {strings} from '../../i18nLibrary';
import * as ACTION_TYPE from '../../actions/action-types';

export default function(state = initialState, action) {
	switch (action.type) {
		case ACTION_TYPE.EXHIBIT_DELETED:
			return {
				...state,
				loading: true
			};

		case ACTION_TYPE.EXHIBIT_DELETE_SUCCESS:
			return {
				...state,
				loading: false
			};

		case ACTION_TYPE.EXHIBIT_DELETE_ERRORED:
			return {
				...state,
				errored: true
			};

		default:
			return state;
	}
}
