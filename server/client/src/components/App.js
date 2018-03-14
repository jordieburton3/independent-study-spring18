import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Login, SignUp, Verify } from './auth';
import PrivateRoute from './routers';
import Courses from './courses';
import Header from './Header/Header';
import { checkCredentials } from '../utils';

class App extends React.Component {
	componentWillMount() {
		checkCredentials(this.props.dispatch);
	}

	componentWillReceiveProps(nextProps) {
		const token = this.props.token ? this.props.token.token : false;
		const nextToken = nextProps.token ? nextProps.token.token : false;
		if (!token && nextToken) {
			checkCredentials(this.props.dispatch);
		}
	}

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
						signedIn={this.props.token}
						verified={this.props.verified}
					/>
				</div>
			</BrowserRouter>
		);
	}
}

const mapStateToProps = ({ token, verified }) => {
	return {
		token,
		verified
	};
};

export default connect(mapStateToProps)(App);
