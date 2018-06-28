import { SORT_BY } from '../actions/sortBy';

export default (state = null, action) => {
	switch (action.type) {
		case SORT_BY:
			return {
				...state,
				sortBy: action.sortBy
			}
		default:
			return {
                ...state,
                sortBy: 'newest'
            };
	}
};