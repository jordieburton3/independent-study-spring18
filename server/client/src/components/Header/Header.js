import React from 'react';
import { connect } from 'react-redux';
import { verifyToken } from '../../actions';
import { Link } from 'react-router-dom';
import SignedInHeader from './SignedInHeader';
import SignedOutHeader from './SignedOutHeader';

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = { verified: false };
	}

	checkVerified() {
		const rawToken = localStorage.getItem('jwt');
		const token = rawToken ? JSON.parse(rawToken) : undefined;
		this.setState({
			verified: verifyToken(this.props.dispatch, token)
		});
	}

	componentWillMount() {
		this.checkVerified();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.token.token) {
			const rawToken = localStorage.getItem('jwt');
			const token = rawToken ? JSON.parse(rawToken) : undefined;
			this.setState({
				verified:
					verifyToken(this.props.dispatch, token) && nextProps.token.token
			});
			window.location.reload();
		}
	}

	render() {
		//const t = this.props.token;
		return (
			<div>
				<Link to="/">Home</Link>
				{this.state.verified ? <SignedInHeader /> : <SignedOutHeader />}
				{/* <button onClick={async () => {
					const payload = {
						token: rawToken ? JSON.parse(localStorage.getItem('jwt')).encoded : 'null'
          };
          await axios.post('/api/test', payload);
				}}>Test</button> */}
			</div>
		);
	}
}

const mapStateToProps = ({ token }) => {
	return {
		token
	};
};

export default connect(mapStateToProps)(Header);
