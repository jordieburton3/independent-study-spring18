import tokenReducer from './tokenReducer';
import verifiedReducer from './verifiedReducer';
import courseReducer from './courseReducer';
import { combineReducers } from 'redux';

export default () =>
	combineReducers({
		token: tokenReducer,
		verified: verifiedReducer,
		currentCourse: courseReducer
	});
