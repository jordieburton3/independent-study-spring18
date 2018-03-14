import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const renderedContent = (props, signedInNotVerified) => {
	let renderedContent = <div />;
	//console.log(signedInNotVerified);
	if (signedInNotVerified) {
		renderedContent = (
			<Redirect to={{ pathname: '/', state: { from: props.location } }} />
		);
	} else {
		renderedContent = (
			<Redirect to={{ pathname: '/login', state: { from: props.location } }} />
		);
	}
	return renderedContent;
};

// from https://stackoverflow.com/questions/43164554/how-to-implement-authenticated-routes-in-react-router-4
const PrivateRoute = ({
	component: Component,
	signedIn,
	verified,
	...rest
}) => {
	const isVerified = verified ? verified.verified : null;
	const token = signedIn ? signedIn.token : null;
	const authed = token && isVerified;
	const signedInNotVerified = token && !isVerified;
	//console.log(`The value of authed is ${token}`);
	console.log(isVerified);
	const content = props => (
		<Route
			{...rest}
			render={props =>
				authed ? (
					<Component {...props} />
				) : (
					renderedContent(props, signedInNotVerified)
				)
			}
		/>
	);
	const toRender = props =>
		isVerified == null || token == null ? <div /> : content(props);
	return <Route {...rest} render={props => toRender(props)} />;
};

export default PrivateRoute;
