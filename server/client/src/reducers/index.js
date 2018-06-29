import tokenReducer from './tokenReducer';
import verifiedReducer from './verifiedReducer';
import courseReducer from './courseReducer';
import sortByReducer from './sortByReducer';
import permissionReducer from './permissionReducer';
import { combineReducers } from 'redux';

export default () =>
	combineReducers({
		token: tokenReducer,
		verified: verifiedReducer,
		currentCourse: courseReducer,
		sortBy: sortByReducer,
		permission: permissionReducer
	});
