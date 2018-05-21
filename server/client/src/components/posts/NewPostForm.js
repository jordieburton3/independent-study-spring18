import React from 'react';
import axios from 'axios';
import moment from 'moment';

export default class NewPostForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message: ''
		};
	}

	onMessageChange(e) {
		e.preventDefault();
		console.log(e.target);
		const message = e.target.value;
		this.setState(() => ({ message }));
	}

	async onSubmit(e) {
		e.preventDefault();
		const rawCourseInfo = localStorage.getItem('course');
		if (rawCourseInfo) {
			const message = e.target.message.value;
			const jwt = JSON.parse(localStorage.getItem('jwt'));
			const user = jwt.user.email;
			const token = jwt.encoded;
			const courseInfo = JSON.parse(rawCourseInfo);
			const payload = {
				postInfo: {
					message,
					poster: user,
					timestamp: moment.now()
				},
				token,
                sender: user,
                courseInfo
			};
			await axios.post('/api/add_post', payload);
			window.location.reload();
		}
	}

	render() {
		return (
			<div>
				<form id="add_post" onSubmit={this.onSubmit}>
					<textarea rows="4" cols="50" name="message" form="add_post" />
					<button>AddPost</button>
				</form>
			</div>
		);
	}
}
