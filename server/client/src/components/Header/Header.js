import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import SignedInHeader from './SignedInHeader';
import SignedOutHeader from './SignedOutHeader';
import { checkCredentials } from '../../utils';

class Header extends React.Component {
	componentWillMount() {
		checkCredentials(this.props.dispatch);
	}

	render() {
		const token = this.props.token ? this.props.token.token : false;
		//console.log(this.props.token ? console.log(`the value is ${this.props.token.token}`) : console.log('doesnt exist'));
		return (
			<div>
				<Link to="/">Home</Link>
				{token ? <SignedInHeader /> : <SignedOutHeader />}
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

const mapStateToProps = ({ token, verified }) => {
	return {
		token,
		verified
	};
};

export default connect(mapStateToProps)(Header);
