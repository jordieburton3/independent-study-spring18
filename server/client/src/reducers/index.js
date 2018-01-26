import tokenReducer from './tokenReducer';
import { combineReducers } from "redux";

export default () => combineReducers({
    token: tokenReducer 
});