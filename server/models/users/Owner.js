const User = require('./User');

const OWNER = 'owner';

const newOwner = (name, email, password, done) => {
	User.newUser(name, email, password, done, OWNER);
};

module.exports = {
	newOwner: newOwner
};
