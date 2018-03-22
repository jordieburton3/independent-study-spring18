import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

class CourseForm extends React.Component {
	constructor(props) {
		super(props);
		const defaultDescription = sessionStorage.getItem('new_course_description')
			? sessionStorage.getItem('new_course_description')
			: '';
		const defaultTitle = sessionStorage.getItem('new_course_title')
			? sessionStorage.getItem('new_course_title')
			: '';
		this.state = {
			description: props.description ? props.description : defaultDescription,
			title: props.title ? props.title : defaultTitle,
			errors: []
		};
	}

	onDescriptionChange = e => {
		const description = e.target.value;
		if (description.length < 150) {
			sessionStorage.setItem('new_course_description', description);
			this.setState(() => ({ description }));
		}
	};

	onTitleChange = e => {
		const title = e.target.value;
		if (title.length < 60) {
			sessionStorage.setItem('new_course_title', title);
			this.setState(() => ({ title }));
		}
	};

	onSubmit = async e => {
		e.preventDefault();
		const title = this.state.title;
		const description = this.state.description;
		const creator = JSON.parse(localStorage.getItem('jwt')).user.email;
		const token = JSON.parse(localStorage.getItem('jwt')).encoded;
		const payload = {
			title,
			description,
			creator,
			token
		};
		const result = await axios.post('/api/new_course', payload);
		if (!result.data.err) {
			sessionStorage.clear();
			this.props.history.push('/my_courses');
		}
	};

	render() {
		return (
			<div>
				<form>
					<input
						type="text"
						placeholder="Course Title"
						autoFocus
						value={this.state.title}
						onChange={this.onTitleChange}
					/>
					<input
						type="text"
						placeholder="Course Description"
						autoFocus
						value={this.state.description}
						onChange={this.onDescriptionChange}
					/>
					<button onClick={this.onSubmit}>Create Course</button>
				</form>
			</div>
		);
	}
}

export default withRouter(CourseForm);
