import moment from 'moment';
import expireToken from './expireToken';

const verifyToken = (dispatch, token = { exp: 0 }) => {
	if (!token) {
		return false;
	}
	if (token.exp < moment.now() / 1000) {
		//console.log(moment.now() / 1000);
		//console.log(token.exp);
		localStorage.removeItem('jwt');
		localStorage.removeItem('verifiedToken');
		dispatch(expireToken());
		return false;
	}
	return true;
};

export default verifyToken;
