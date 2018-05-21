import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Courses } from '../courses';
import expireToken from '../../actions/expireToken';

class SignedInHeader extends React.Component {
	constructor(props) {
		super(props);
		this.signOut = this.signOut.bind(this);
	}

	signOut() {
		this.props.dispatch(expireToken());
		window.location.reload();
	}

	render() {
		//	const current_course = localStorage.getItem('current_course');
		return (
			<div>
				<Courses />
				<Link to="/create_course">Create Course</Link>
				<Link to="/add_users">Add Users</Link>
				<Link to="/posts">Posts</Link>
				{/* {current_course ? <p>{ current_course }</p> : null} */}
				<button onClick={this.signOut}>
					sign out
				</button>
			</div>
		);
	}
}

export default connect()(SignedInHeader);
