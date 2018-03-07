import React from 'react';
import axios from 'axios';
import { newToken } from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';
import { verifyToken } from '../../actions';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = { error: null, success: false };
	}

	handleUserAuth = async e => {
		e.preventDefault();
		const email = e.target.elements.email.value.trim().toLowerCase();
		const password = e.target.elements.password.value.trim();
		e.target.elements.email.value = '';
		e.target.elements.password.value = '';
		if (!email && !password) {
			this.setState({
				error: null
			});
			return;
		}
		const payload = {
			email,
			password
		};
		const res = await axios.post('/api/login', payload);
		if (!res.data.errResponse) {
			const token = JSON.stringify(res.data.token);
			localStorage.setItem('jwt', token);
			//console.log(res.data);
			if (res.data.verified) {
				localStorage.setItem('verifiedToken', res.data.verified);
			}
			this.props.dispatch(newToken());
			this.setState({ verified: true });
		} else if (res.data.errResponse) {
			this.setState({
				error: res.data.errResponse
			});
		}
	};

	render() {
		return (
			<div>
				{this.state.error && (
					<p>Invalid username or password. Please try again.</p>
				)}
				<form onSubmit={this.handleUserAuth}>
					<input type="text" name="email" placeholder="email" />
					<input type="password" name="password" placeholder="password" />
					<button>Submit</button>
				</form>
				{this.state.verified && <Redirect to="/" push />}
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => {
	let actions = bindActionCreators({
		newToken
	});
	return { ...actions, dispatch };
};

const mapStateToProps = ({ token }) => {
	return {
		token
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
