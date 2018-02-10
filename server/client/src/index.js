import React from "react";
import ReactDOM from "react-dom";
// import Authentication from './components/auth';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import reduxThunk from 'redux-thunk';
import App from './components/App'

const store = createStore(reducer(), {}, applyMiddleware(reduxThunk));

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById("root"));
