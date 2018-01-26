import React from 'react';
import axios from 'axios';
import { newToken } from '../../actions'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

class Login extends React.Component {
	handleUserAuth = async e => {
		e.preventDefault();
		const email = e.target.elements.email.value.trim().toLowerCase();
		const password = e.target.elements.password.value.trim();
		e.target.elements.email.value = '';
		e.target.elements.password.value = '';
		const payload = {
			email,
			password
		};
		const res = await axios.post('/api/login', payload);
        console.log(res);
        localStorage.setItem('jwt', res.data.token);
		console.log(localStorage.getItem('jwt'));
		this.props.dispatch(newToken());
	};

	render() {
		return (
			<div>
				<form onSubmit={this.handleUserAuth}>
					<input type="text" name="email" />
					<input type="text" name="password" />
					<button>Submit</button>
				</form>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	let actions = bindActionCreators({ 
		newToken  
	});
	return { ...actions, dispatch };
} 

export default connect(null, mapDispatchToProps)(Login);
