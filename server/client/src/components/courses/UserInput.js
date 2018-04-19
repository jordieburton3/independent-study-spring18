import React from 'react';

export default class UserInput extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.state = {
			type: 'user'
		};
	}

	handleChange(e) {
		const value = e.target.value;
		this.setState({ type: value });
	}

	render() {
		const type = this.state.type;
		return (
			<div>
				<input type="text" placeholder="email" />
				<select value={type} onChange={this.handleChange}>
					<option defaultValue value="user">
						As User
					</option>
					<option value="admin">As Admin</option>
				</select>
			</div>
		);
	}
}
