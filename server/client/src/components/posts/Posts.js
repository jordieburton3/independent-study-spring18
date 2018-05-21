import React from 'react';
import axios from 'axios';
import Post from './Post';
import NewPostForm from './NewPostForm';

export default class Posts extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			posts: [],
			addingPost: false
		};
	}

	async componentWillMount() {
		const rawCourseInfo = localStorage.getItem('course');
		if (rawCourseInfo) {
			const jwt = JSON.parse(localStorage.getItem('jwt'));
			const user = jwt.user.email;
			const token = jwt.encoded;
			const courseInfo = JSON.parse(rawCourseInfo);
			const payload = {
				courseInfo,
				sender: user,
				token
			};
			const res = await axios.post('/api/get_posts', payload);
			const posts = res.data.posts;
			this.setState({ posts });
		}
	}

	render() {
		return (
			<div>
				<NewPostForm />
				{this.state.posts.map((elem, index) => (
					<Post
						message={elem.message}
						poster={elem.poster}
						timestamp={elem.timestamp}
						key={index}
					/>
				))}
			</div>
		);
	}
}
