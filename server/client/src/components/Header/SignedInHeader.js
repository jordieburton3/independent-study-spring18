import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import expireToken from '../../actions/expireToken';

class SignedInHeader extends React.Component {
	render() {
		const current_course = localStorage.getItem('current_course');	
		return (
			<div>
				<Link to="/my_courses">My Courses</Link>
				<Link to="/create_course">Create Course</Link>
				{current_course ? <p>{ current_course }</p> : null}
				<button onClick={() => this.props.dispatch(expireToken())}>
					sign out
				</button>
			</div>
		);
	}
}

export default connect()(SignedInHeader);
