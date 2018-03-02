import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { verifyToken } from '../../actions';

class SignUp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			passwordValidationError: null,
			emailValidationError: null
		};
	}

	renderRedirectContent() {
		return verifyToken(
			this.props.dispatch,
			localStorage.getItem('jwt')
				? JSON.parse(localStorage.getItem('jwt'))
				: undefined
		) ? (
			<Redirect to="/" push />
		) : null;
	}

	handleUserSignup = async e => {
		e.preventDefault();
		this.setState({
			passwordValidationError: null,
			emailValidationError: null
		});
		const email = e.target.elements.email.value.trim().toLowerCase();
		const name = e.target.elements.name.value.trim();
		const password = e.target.elements.password.value.trim();
		e.target.elements.name.value = '';
		e.target.elements.email.value = '';
		e.target.elements.password.value = '';
		const payload = {
			email,
			name,
			password
		};
		const res = await axios.post('/api/new_user', payload);
		if (!res.data.error) {
			this.props.history.push('/');
			return;
		}
		if (res.data.error.passwordValidationError) {
			this.setState({
				passwordValidationError: res.data.error.passwordValidationError
			});
		}
		if (res.data.error.emailValidationError) {
			this.setState({
				emailValidationError: res.data.error.emailValidationError
			});
		}
	};

	render() {
		return (
			<div>
				{this.renderRedirectContent()}
				<form onSubmit={this.handleUserSignup}>
					<input type="text" name="name" placeholder="Full Name" />
					{this.state.emailValidationError && <p>Invalid Email</p>}
					<input type="text" name="email" placeholder="email" />
					{this.state.passwordValidationError && (
						<p>{this.state.passwordValidationError.message}</p>
					)}
					<input type="password" name="password" placeholder="password" />
					<button>Register</button>
				</form>
			</div>
		);
	}
}

const mapStateToProps = ({ token }) => {
	return {
		token
	};
};

export default connect(mapStateToProps)(SignUp);
