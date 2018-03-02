import React from 'react';
import { verifyToken } from '../../actions';
import { Redirect, Route } from 'react-router-dom';

const renderedContent = (props, signedInNotVerified) => {
	let renderedContent = <div />;
	if (signedInNotVerified) {
		renderedContent = <Redirect to={{ pathname: '/', state: { from: props.location } }} />
	} else {
		renderedContent = <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
	}
	return renderedContent;
}

// from https://stackoverflow.com/questions/43164554/how-to-implement-authenticated-routes-in-react-router-4
const PrivateRoute = ({ component: Component, dispatch, ...rest }) => {
	const verified = localStorage.getItem('verifiedToken');
	const rawToken = localStorage.getItem('jwt');
	const token = rawToken ? JSON.parse(rawToken) : undefined;
	const signedIn = verifyToken(dispatch, token);
	const signedInNotVerified = signedIn && !verified;
	const authed = verifyToken(dispatch, token) && verified;
	
	return (
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
};

export default PrivateRoute;
