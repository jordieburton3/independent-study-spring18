import { MARK_VERIFIED, MARK_UNVERIFIED } from '../actions/types';

export default (state = null, action) => {
	switch (action.type) {
		case MARK_VERIFIED:
			//console.log("vvvvvv");
			return {
				...state,
				verified: true
			};
		case MARK_UNVERIFIED:
			return {
				...state,
				verified: false
			};
		default:
			//console.log('default');
			return state;
	}
};
