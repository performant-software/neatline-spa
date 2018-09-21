import initialState from './leaflet-initialState';
import * as ACTION_TYPE from '../../actions/action-types';


export default function(state = initialState, action) {
	switch (action.type) {

		// On initiate create...
		case ACTION_TYPE.LEAFLET_IS_EDITING:
			return {
				...state,
			   isEditing: action.payload
			};

			case ACTION_TYPE.LEAFLET_IS_SAVING:
				return {
					...state,
				   isSaving: action.payload
				};

		default:
			return state;
	}
}
