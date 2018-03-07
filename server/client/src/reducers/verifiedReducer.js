import { MARK_VERIFIED, MARK_UNVERIFIED } from '../actions/types';

export default (state = null, action) => {
	//console.log(action.type);
	switch (action.type) {
		case MARK_VERIFIED:
			localStorage.removeItem('jwt');
			return {
				...state,
				verified: true
			};
		case MARK_UNVERIFIED:
			//console.log('set false');
			return {
				...state,
				verified: false
			};
		default:
			//console.log('default');
			return state;
	}
};
