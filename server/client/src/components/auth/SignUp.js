import React from 'react';
import axios from 'axios';

export default class SignUp extends React.Component {
	handleUserSignup = async e => {
		e.preventDefault();
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
		console.log(res);
	};

	render() {
		return (
			<div>
				<form onSubmit={this.handleUserSignup}>
					<input type="text" name="name" placeholder='Full Name'/>
					<input type="text" name="email" placeholder='email'/>
					<input type="password" name="password" placeholder='password'/>
					<button>Register</button>
				</form>
			</div>
		);
	}
}
