import initialState from './initialState-record';
import * as ACTION_TYPE from '../actions/action-types';
import {strings} from '../i18nLibrary';

export default function(state = initialState, action) {
	switch (action.type) {

		// On initiate create...
		case ACTION_TYPE.RECORD_CREATE:
			return {
			  ...state,
			  loading: true,
			  newRecord: action.payload
			};


		// Handle response from create record API call
		case ACTION_TYPE.CREATE_RECORD_RESPONSE_RECEIVED:

			// Failed with error from API server
			if (typeof action.payload.errors !== 'undefined') {
				console.error(`CREATE_RECORD_ERROR: ${action.payload.errors.error}`);
				return {
					...state,
					error: strings.create_record_error
				};

			// Accepted (RECORD_CREATED)
			} else {
				return {
					...state,
					loading: false,
					error: '',
					newRecord: action.record
				};
			}


		// On initiate delete...
		case ACTION_TYPE.RECORD_DELETE:
			return {
	          ...state,
	          loading: true
	        };

		// Handle response from delete record API call
		case ACTION_TYPE.DELETE_RECORD_RESPONSE_RECEIVED:

			// Failed with error from API server
			if (typeof action.payload.jsonResponse.errors !== 'undefined') {
				console.error(`DELETE_RECORD_ERROR: ${action.payload.jsonResponse.errors.error}`);
				return {
					...state,
					error: strings.delete_record_error
				};

			// Accepted (RECORD_DELETED)
			} else {
				return {
					...state,
					loading: false,
					error: ''
				};
			}

		// Handle response from update record API call
		case ACTION_TYPE.UPDATE_RECORD_RESPONSE_RECEIVED:

			// Failed with error from API server
			if (typeof action.payload.errors !== 'undefined') {
				console.error(`UPDATE_RECORD_ERROR: ${action.payload.errors.error}`);
				return {
					...state,
					error: strings.update_record_error
				};

				// Accepted
			} else {
				return {
					...state,
					loading: false,
					changedRecord: action.payload,
					error: ''
				};
			}

		// A wild error appeared!
		case ACTION_TYPE.RECORD_ERROR:
			console.error(`RECORD_ERROR: ${action.payload.error}`);
			return {
				...state,
				error: action.payload.message
			};

		// Reset
		case ACTION_TYPE.NEW_RECORD_RESET:
			return initialState;

		default:
			return state;
	}
}
