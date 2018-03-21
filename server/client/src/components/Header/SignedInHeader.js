import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import expireToken from '../../actions/expireToken';

class SignedInHeader extends React.Component {
	render() {
		return (
			<div>
				<Link to="/my_courses">My Courses</Link>
				<Link to="/create_course">Create Course</Link>
				<button onClick={() => this.props.dispatch(expireToken())}>
					sign out
				</button>
			</div>
		);
	}
}

export default connect()(SignedInHeader);
