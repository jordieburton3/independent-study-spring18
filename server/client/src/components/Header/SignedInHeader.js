import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Courses } from '../courses';
import axios from 'axios';
import expireToken from '../../actions/expireToken';
import { setPermission } from '../../actions'

class SignedInHeader extends React.Component {
	constructor(props) {
		super(props);
		this.signOut = this.signOut.bind(this);
		this.fetchPermission = this.fetchPermission.bind(this);
	}

	async fetchPermission() {
		const jwt = JSON.parse(localStorage.getItem('jwt'));
		const currCourse = localStorage.getItem('course')
			? JSON.parse(localStorage.getItem('course'))
			: false;
		if(currCourse) {
			const payload = { sender: jwt.user.email, token: jwt.encoded, courseInfo: currCourse };
			const result = await axios.post('/api/get_permission', payload);
			this.props.dispatch(setPermission((result.data.permission)))
		}
	}

	async componentWillMount() {
		this.fetchPermission();
	}

	async shouldComponentUpdate(nextProps) {
		if (nextProps.currentCourse !== this.props.currentCourse) {
			this.fetchPermission();
		}
	}

	signOut() {
		this.props.dispatch(expireToken());
		window.location.reload();
	}

	render() {
		const ownerPermission = this.props.permission ? this.props.permission.permission === 'owner' : false;
		const adminPermission = this.props.permission ? this.props.permission.permission === 'admin' : false;	
		return (
			<div>
				<Courses />
				<Link to="/create_course">Create Course</Link>
				{ (ownerPermission || adminPermission) && <Link to="/add_users">Add Users</Link> }
				{ this.props.currentCourse && <Link to="/posts">Posts</Link> }
				<button onClick={this.signOut}>sign out</button>
			</div>
		);
	}
}

const mapStateToProps = ({ currentCourse, permission }) => {
	return {
		permission,
		currentCourse
	};
};

export default connect(mapStateToProps)(SignedInHeader);
