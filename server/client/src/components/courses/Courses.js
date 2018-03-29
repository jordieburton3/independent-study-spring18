import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { currentCourse } from '../../actions';

class Courses extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			courses: [],
			value: ''
		};
		this.handleChange = this.handleChange.bind(this);
	}

	async fetchCourses() {
		const user = JSON.parse(localStorage.getItem('jwt')).user.email;
		const token = JSON.parse(localStorage.getItem('jwt')).encoded;
		const payload = { user, token };
		const result = await axios.post('/api/fetch_all_courses', payload);
		console.log(result);
		if (!result.data.err) {
			this.setState({ courses: result.data });
		}
	}

	async componentWillMount() {
		await this.fetchCourses();
		const currCourse = localStorage.getItem('course') ? localStorage.getItem('course') : false;
		if (currCourse) {
			this.props.dispatch(currentCourse(currCourse));
		}
	}

	handleChange(e) {
		const value = e.target.value;
		if (value !== '') {
			localStorage.setItem('course', value);
			this.setState({ value: value });
			this.props.dispatch(currentCourse(value));
		}
	}

	render() {
		const currCourse = this.props.currentCourse ? this.props.currentCourse.currentCourse : '';
		return (
			<div>
				<form>
					<select value={currCourse} onChange={this.handleChange}>
						<option disabled value>
							Select Course
						</option>
						<option disabled>Current Course: {currCourse}</option>
						<option defaultValue disabled></option>
						{this.state.courses.map((course, index) => (
							<option key={index} value={course.title}>
								{course.title}
							</option>
						))}
					</select>
				</form>
			</div>
		);
	}
}

const mapStateToProps = ({ currentCourse }) => {
	return {
		currentCourse
	};
};

export default connect(mapStateToProps)(Courses);
