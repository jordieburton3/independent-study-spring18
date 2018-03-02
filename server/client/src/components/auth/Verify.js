import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';

export default class Verify extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			verified: false,
			error: null
		};
	}

	componentDidMount() {
		this.verifyUser();
	}

	verifyUser = async () => {
		const payload = {
			hash: this.props.match.params.id
		};
		//console.log(payload);
		const res = await axios.post('/api/verify', payload);
		console.log(res);
		if (res.data.success) {
			localStorage.setItem('verifiedToken', res.data.verified);
		} else {
			this.setState({
				error: true
			});
		}
	};

	render() {
		return (
			<div>{localStorage.getItem('verifiedToken') && <Redirect to="/" />}</div>
		);
	}
}
