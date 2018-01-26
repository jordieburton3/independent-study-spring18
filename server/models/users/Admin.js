const User = require('./User');

const ADMIN = 'admin';

const newAdmin = (name, email, password, done) => {
    User.newUser(name, email, password, done, ADMIN);
}

module.exports = {
    newAdmin: newAdmin
}