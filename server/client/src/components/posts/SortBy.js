import React from 'react';
import { changeSortMethod } from '../../actions/sortBy';
import { connect } from 'react-redux';

class SortBy extends React.Component {
    constructor(props) {
		super(props);
        this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
        const value = e.target.value;
		this.props.dispatch(changeSortMethod(value));
	}

	render() {
        const type = this.props.sortBy.sortBy;
        //console.log(type);
		return (
			<div>
				<select value={type} onChange={this.handleChange}>
					<option defaultValue value="newest">
						Most Recent
					</option>
					<option value="oldest">Oldest</option>
				</select>
			</div>
		);
	}
}

const mapStateToProps = ({ sortBy }) => {
	return {
		sortBy
	};
};

export default connect(mapStateToProps)(SortBy);