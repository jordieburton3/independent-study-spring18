import React from "react";
import ReactDOM from "react-dom";
// import Authentication from './components/auth';
import Header from './components/Header'
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import reduxThunk from 'redux-thunk';

const store = createStore(reducer(), {}, applyMiddleware(reduxThunk));

ReactDOM.render(<Provider store={store}><Header /></Provider>, document.getElementById("root"));
