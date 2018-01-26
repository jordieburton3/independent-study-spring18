import moment from 'moment';
import expireToken from './expireToken';

const verifyToken = (dispatch, token) => {
    if (!token) {
        return false;
    }
    if (token.exp < moment.now()) {
        dispatch(expireToken);
        return false;
    }
    return true;
}

export default verifyToken;