import React from 'react';
import axios from 'axios';

export default class SignUp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			passwordValidationError: null,
			emailValidationError: null
		}
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
				<form onSubmit={this.handleUserSignup}>
					<input type="text" name="name" placeholder='Full Name'/>
					{this.state.emailValidationError && <p>Invalid Email</p>}
					<input type="text" name="email" placeholder='email'/>
					{this.state.passwordValidationError && <p>{this.state.passwordValidationError.message}</p>}
					<input type="password" name="password" placeholder='password'/>
					<button>Register</button>
				</form>
			</div>
		);
	}
}
