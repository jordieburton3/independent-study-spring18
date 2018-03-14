import {
	verifyToken,
	newToken,
	expireToken,
	verified,
	notVerified
} from '../actions';

const checkCredentials = dispatch => {
	const verifiedToken = localStorage.getItem('verifiedToken');
	const rawToken = localStorage.getItem('jwt');
	const token = rawToken ? JSON.parse(rawToken) : undefined;
	const signedIn = verifyToken(dispatch, token);
	//console.log(verifiedToken ? console.log("1") : console.log("2"));
	if (signedIn) {
		dispatch(newToken());
	} else {
		dispatch(expireToken());
	}
	if (verifiedToken) {
		dispatch(verified());
	} else {
		dispatch(notVerified());
	}
};

export default checkCredentials;
