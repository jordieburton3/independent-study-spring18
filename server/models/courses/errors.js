const prefix = 'course';

const noCourseError = {
	code: `${prefix}_existance`,
	message: 'Course does not exist'
};

const noPrivilegeError = {
	code: `${prefix}_insufficient_privilege`,
	message: 'Insufficient level of privilege'
};

const doesNotExistError = {
	code: `user_nonexistant`,
	message: 'User does not exist'
};

const alreadyContainedError = {
	code: `user_already_containted`,
	message: 'User is already in the course'
};

const cantAddOwnerError = {
	code: `cannot_add_owner`,
	message: 'You cannot add the owner to their own course'
};

module.exports = {
	noCourseError,
	noPrivilegeError,
	doesNotExistError,
	alreadyContainedError,
	cantAddOwnerError
};
