import React from 'react';
import axios from 'axios';
import Post from './Post';
import moment from 'moment';
import { connect } from 'react-redux';
import NewPostForm from './NewPostForm';
import SortBy from './SortBy';
import { sortPostsByDate } from '../../utils';

class Posts extends React.Component {
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
			sortPostsByDate(posts, this.props.sortBy);		
			this.setState({ posts });
		}
	}

	async shouldComponentUpdate(nextProps) {
		const rawCourseInfo = localStorage.getItem('course');
		if (rawCourseInfo) {
			const parsedCourseInfo = JSON.parse(rawCourseInfo);
			const currentCourse = this.props.currentCourse
				? JSON.parse(this.props.currentCourse.currentCourse)
				: '';
			if (parsedCourseInfo.id !== currentCourse.id) {
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
				sortPostsByDate(posts, this.props.sortBy);	
				this.setState({ posts });
			} else if (this.props.sortBy !== nextProps.sortBy) {
				const sortedPosts = sortPostsByDate(this.state.posts, nextProps.sortBy);
				this.setState({ sortedPosts });
			}
		}
	}

	render() {
		return (
			<div>
				<NewPostForm />
				<SortBy />
				{this.state.posts.map((elem, index) => (
					<Post
						message={elem.message}
						poster={elem.poster}
						timestamp={moment(elem.timestamp).format('DD MMM YYYY hh:mm a')}
						key={index}
					/>
				))}
			</div>
		);
	}
}

const mapStateToProps = ({ currentCourse, sortBy }) => {
	return {
		currentCourse,
		sortBy
	};
};

export default connect(mapStateToProps)(Posts);
