const prefix = 'user';

const hashingError = {
	code: `${prefix}_hash_failed`,
	message: 'Could not process the given password'
};

const noUserError = {
	code: `${prefix}_no_user`,
	message: 'Could not find user'
};

const emailValidationError = {
	code: `${prefix}_email_validation`,
	message: 'Invalid email address'
};

const passwordValidationError = {
	code: `${prefix}_password_validation`,
	message:
		'Password must contain a capital letter, a special character, and at least 10 characters'
};

const invalidPasswordError = {
	code: `${prefix}_invalid_password`,
	message: 'Email or password was incorrect'
};

module.exports = {
	hashingError: hashingError,
	noUserError: noUserError,
	emailValidationError: emailValidationError,
	passwordValidationError: passwordValidationError,
	invalidPasswordError: invalidPasswordError
};
