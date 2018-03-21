import React from 'react';

export default class CourseForm extends React.Component {
	constructor(props) {
        super(props);
        const defaultDescription = sessionStorage.getItem('new_course_description') ? sessionStorage.getItem('new_course_description') : '';
        const defaultTitle = sessionStorage.getItem('new_course_title') ? sessionStorage.getItem('new_course_title') : '';
		this.state = {
			description: props.description
				? props.description
				: defaultDescription,
			title: props.title
				? props.title
                : defaultTitle,
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

	onSubmit = e => {
		e.preventDefault();
		sessionStorage.clear()
		const title = this.state.title;
		const desc = this.state.description;
		console.log(e.target.value);
		// if (!this.state.description || !this.state.amount) {
		//     // set error message
		//     this.setState(() => ({ error: 'You need to have a description AND an amount!'}));
		// } else {
		//     this.setState(() => ({ error: ''}));
		//     this.props.onSubmit({
		//         description: this.state.description,
		//         amount: parseFloat(this.state.amount, 10) * 100,
		//         createdAt: this.state.createdAt.valueOf(),
		//         note: this.state.note
		//     });
		// }
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
