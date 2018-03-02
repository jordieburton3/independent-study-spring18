import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Login, SignUp, Verify } from './auth';
import PrivateRoute from './routers';
import Courses from './courses';
import Header from './Header/Header';

class App extends React.Component {
	render() {
		return (
			<BrowserRouter>
				<div>
					<Header />
					<Route path="/login" component={Login} exact={true} />
					<Route exact path="/signup" component={SignUp} />
					<Route exact path="/verify/:id" component={Verify} />
					<PrivateRoute
						exact
						path="/my_courses"
						dispatch={this.props.dispatch}
						component={Courses}
					/>
				</div>
			</BrowserRouter>
		);
	}
}

export default connect()(App);
