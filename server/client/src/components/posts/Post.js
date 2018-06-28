import React from 'react';

export default class Post extends React.Component {
	constructor(props) {
		super(props);
		const message = this.props.message;
		const poster = this.props.poster;
		const timestamp = this.props.timestamp;
		this.state = {
			message,
			poster,
			timestamp
		};
	}

	shouldComponentUpdate(nextProps) {
		if (nextProps.message !== this.state.message) {
			this.setState({
				...nextProps
			});
			return true;
		}
		return false;
	}

	render() {
		return (
			<div>
				<h5>{this.state.poster}</h5>
				<p>{this.state.timestamp}</p>
				<p>{this.state.message}</p>
			</div>
		);
	}
}
