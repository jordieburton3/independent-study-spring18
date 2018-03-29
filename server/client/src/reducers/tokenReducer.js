import { MARK_EXPIRED, MARK_VALID } from '../actions/types';

export default (state = null, action) => {
	//console.log(action.type);
	switch (action.type) {
		case MARK_EXPIRED:
			//console.log('mark expired');
			localStorage.removeItem('jwt');
			localStorage.removeItem('course');
			localStorage.removeItem('verifiedToken');
			sessionStorage.removeItem('new_course_description');
			sessionStorage.removeItem('new_course_title');
			return {
				...state,
				token: false
			};
		case MARK_VALID:
			//console.log('set true');
			return {
				...state,
				token: true
			};
		default:
			//console.log('default');
			return state;
	}
};
