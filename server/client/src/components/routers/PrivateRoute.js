import React from 'react';
import { connect } from 'react-redux';
import { verifyToken } from '../../actions';
import { Redirect, Route } from 'react-router-dom';

// const renderedContent = (props, signedInNotVerified) => {
// 	let renderedContent = <div />;
// 	if (signedInNotVerified) {
// 		renderedContent = <Redirect to={{ pathname: '/', state: { from: props.location } }} />
// 	} else {
// 		renderedContent = <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
// 	}
// 	return renderedContent;
// }

// // from https://stackoverflow.com/questions/43164554/how-to-implement-authenticated-routes-in-react-router-4
// const PrivateRoute = ({ component: Component, dispatch, ...rest }) => {
// 	const verified = localStorage.getItem('verifiedToken');
// 	const rawToken = localStorage.getItem('jwt');
// 	const token = rawToken ? JSON.parse(rawToken) : undefined;
// 	const signedIn = verifyToken(dispatch, token);
// 	const signedInNotVerified = signedIn && !verified;
// 	const authed = verifyToken(dispatch, token) && verified;

// 	return (
// 		<Route
// 			{...rest}
// 			render={props =>
// 				authed ? (
// 					<Component {...props} />
// 				) : (
// 					renderedContent(props, signedInNotVerified)
// 				)
// 			}
// 		/>
// 	);
// };

// export default PrivateRoute;

class PrivateRoute extends React.Component {
	constructor(props) {
		super(props);
		this.state = { signedInNotVerified: false, authed: false };
	}

	componentWillMount() {
		//console.log("will mount");
		this.checkVerification();
	}

	componentDidMount() {
		//console.log("did mount");
		this.checkVerification();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.token.token) {
			this.checkVerification();
			//this.setState({...nextProps});
			this.forceUpdate();
		}
	}

	checkVerification() {
		const verified = localStorage.getItem('verifiedToken');
		const rawToken = localStorage.getItem('jwt');
		const token = rawToken ? JSON.parse(rawToken) : undefined;
		const signedIn = verifyToken(this.props.dispatch, token);
		const signedInNotVerified = signedIn && !verified;
		if (signedInNotVerified) {
			this.setState({ signedInNotVerified: signedInNotVerified });
		}
		const authed = verifyToken(this.props.dispatch, token) && verified;
		//console.log(`authed is ${authed}`);
		if (authed) {
			this.setState({ authed: authed });
		}
	}

	renderedContent = props => {
		let renderedContent = <div />;
		//console.log(props);
		console.log(this.state);
		if (this.state.signedInNotVerified) {
			//console.log("redirection 1");
			renderedContent = (
				<Redirect to={{ pathname: '/', state: { from: props.location } }} />
			);
		} else {
			//console.log("redirection 2");
			renderedContent = (
				<Redirect
					to={{ pathname: '/login', state: { from: props.location } }}
				/>
			);
		}
		//console.log("not even changing");
		return renderedContent;
	};

	render() {
		const { component: Component, ...rest } = this.props;
		//console.log(this.state);
		//console.log(this.props.token);
		return (
			<Route
				{...rest}
				render={props =>
					this.state.authed ? (
						<Component {...props} />
					) : (
						this.renderedContent(props)
					)
				}
			/>
		);
	}
}

const mapStateToProps = ({ token }) => {
	return {
		token
	};
};

export default connect(mapStateToProps)(PrivateRoute);
