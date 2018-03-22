import React from 'react';
import axios from 'axios';

export default class Courses extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			courses: []
		};
	}

	async componentWillMount() {
		const user = JSON.parse(localStorage.getItem('jwt')).user.email;
		const token = JSON.parse(localStorage.getItem('jwt')).encoded;
		const payload = { user, token };
		const result = await axios.post('/api/fetch_all_courses', payload);
		console.log(result);
		if (!result.data.err) {
			this.setState({ courses: result.data });
		}
	}

	render() {
		return (
			<div>
				{this.state.courses.map((course, index) => (
					<p key={index}>{course.title}</p>
				))}
			</div>
		);
	}
}
