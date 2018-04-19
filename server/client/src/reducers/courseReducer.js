import { MARK_CURRENT, MARK_NEW } from '../actions/types';

export default (state = null, action) => {
	//console.log(action.type);
	switch (action.type) {
		case MARK_NEW:
			return {
				...state
			};
		case MARK_CURRENT:
			return {
				...state,
				currentCourse: action.course
			};
		default:
			//console.log('default');
			return state;
	}
};
