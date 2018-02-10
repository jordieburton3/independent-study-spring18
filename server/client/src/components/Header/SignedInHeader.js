import React from 'react';
import { connect } from 'react-redux';
import expireToken from '../../actions/expireToken';

class SignedInHeader extends React.Component {

    render() {
        return (
            <div>
                <p>My Courses</p>
                <p>Work Courses</p>
                <p>About</p>
                <button onClick={() => this.props.dispatch(expireToken())}>
                    sign out 
                </button>
            </div>
        );
    }
}

export default connect()(SignedInHeader);