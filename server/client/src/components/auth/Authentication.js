import React from 'react';
import SignUp from './SignUp';
import Login from './Login';

export default class Authentication extends React.Component {
	render() {
		return (
			<div>
				<SignUp />
				<Login />
			</div>
		);
	}
}
