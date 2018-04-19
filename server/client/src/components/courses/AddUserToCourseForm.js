import React from 'react';
import UserInput from './UserInput';
import axios from 'axios';

class AddUserToCourseForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userInputs: [],
			errors: []
		};
		this.addInputForm = this.addInputForm.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	addInputForm(e) {
		e.preventDefault();
		const newInputForms = this.state.userInputs.concat([UserInput]);
		this.setState({ userInputs: newInputForms });
	}

	async handleSubmit(e) {
		e.preventDefault();
		// console.log(e.target.elements[1].value);
		const users = [];
		const admins = [];
		const jwt = JSON.parse(localStorage.getItem('jwt'));
		const user = jwt.user.email;
		const token = jwt.encoded;
		const courseInfo = localStorage.getItem('course')
			? JSON.parse(localStorage.getItem('course'))
			: false;
		if (courseInfo) {
			const submissions = e.target.elements;
			for (let i = 0; i < submissions.length; i += 2) {
				if (submissions[i + 1].value === 'user') {
					users.push(submissions[i].value);
				} else if (submissions[i + 1].value === 'admin') {
					admins.push(submissions[i].value);
				}
			}
			const payload = {
				users,
				sender: user,
				token,
				courseInfo
			};
			const userAdditionResult = await axios.post('/api/add_as_user', payload);
			payload.users = admins;
			const adminAdditionResult = await axios.post(
				'/api/add_as_admin',
				payload
			);
			console.log(userAdditionResult);
			console.log(adminAdditionResult);
			const errors = [
				...userAdditionResult.data.errors,
				...adminAdditionResult.data.errors
			];
			this.setState({ errors });
			console.log(errors);
		} else {
			console.log('must select a course!');
		}
	}

	render() {
		const inputs = this.state.userInputs.map((Element, index) => {
			return <Element key={index} index={index} />;
		});
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					{inputs}
					<button onClick={this.addInputForm}>+</button>
					<button disabled={this.state.userInputs < 1}>Add Users</button>
				</form>
				{this.state.errors.length > 0 &&
					this.state.errors.map((error, index) => (
						<p key={index}>
							{error.user ? `User ${error.user} has the following error: ` : ''}
							{error.error.message}
						</p>
					))}
			</div>
		);
	}
}

export default AddUserToCourseForm;
