import tokenReducer from './tokenReducer';
import verifiedReducer from './verifiedReducer';
import { combineReducers } from 'redux';

export default () =>
	combineReducers({
		token: tokenReducer,
		verified: verifiedReducer
	});
