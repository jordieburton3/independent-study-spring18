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
		if (!result.data.err) {
			this.setState({ courses: result.data });
		}
	}

	async componentWillMount() {
		await this.fetchCourses();
		const currCourse = localStorage.getItem('course')
			? localStorage.getItem('course')
			: false;
		if (currCourse) {
			this.props.dispatch(currentCourse(currCourse));
		}
	}

	handleChange(e) {
		const jsonValue = e.target.value;
		if (jsonValue !== '') {
			const value = JSON.parse(jsonValue);
			localStorage.setItem('course', JSON.stringify(value));
			this.setState({ value: value.title });
			// console.log(jsonValue);
			this.props.dispatch(currentCourse(jsonValue));
		}
	}

	render() {
		const currCourse = this.props.currentCourse
			? JSON.parse(this.props.currentCourse.currentCourse)
			: { title: '' };
		// console.log("*********");
		console.log(currCourse);
		// console.log("***********")
		return (
			<div>
				<form>
					<select onChange={this.handleChange}>
						<option selected={!currCourse.title} disabled value="">
							Select Course
						</option>
						<option disabled>Current Course: {currCourse.title}</option>
						{this.state.courses.map((course, index) => (
							<option selected={course.id === currCourse.id} key={index} value={JSON.stringify(course)}>
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
