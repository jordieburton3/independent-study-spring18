import { CHANGE_PERMISSION } from '../actions/types';

export default (state = null, action) => {
	switch (action.type) {
		case CHANGE_PERMISSION:
			
			return {
				...state,
				permission: action.permission
			}
		default:
			return state;
	}
};
