const {
	MODE_PRODUCTION,
	MODE_TEST,
	PRODUCTION_DB,
	TEST_DB
} = require('../../helpers/database/constants');
const { database } = require('../../helpers/database/db');
const {
	hashingError,
	noUserError,
	emailValidationError,
	passwordValidationError,
	invalidPasswordError
} = require('./errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const emailValidator = require('email-validator');
const Validator = require('password-validator');

const passwordValidator = new Validator()
	.is()
	.min(8)
	.has()
	.uppercase()
	.has()
	.digits();

const newUser = (name, email, password, vhash, done, privilege) => {
	const errors = {};
	if (!passwordValidator.validate(password)) {
		errors.passwordValidationError = passwordValidationError;
	}
	if (!emailValidator.validate(email)) {
		errors.emailValidationError = emailValidationError;
	}
	if (!errors.emailValidationError && !errors.passwordValidationError) {
		const permission = privilege ? privilege : 'user';
		bcrypt.hash(password, 10, (err, hash) => {
			if (err) done({}, hashingError);
			else {
				database
					.get()
					.query(
						`INSERT INTO User (name, email, hash, verified, courses) values (?, ?, ?, ?, ?)`,
						[name, email, hash, false, JSON.stringify([])],
						(err, result) => {
							done({}, err);
						}
					);
				database
					.get()
					.query(
						`INSERT INTO Verify (email, vhash) values (?, ?)`,
						[email, vhash],
						(err, result) => {
							//console.log(result);
							//console.log(err);
						}
					);
			}
		});
	} else {
		done({}, errors);
	}
};

const validateUser = (email, password, done) => {
	database
		.get()
		.query(`SELECT * FROM User WHERE email=?`, [email], (err, rows) => {
			if (err) done(false, err);
			else if (rows.length === 0) {
				done({}, noUserError);
			} else {
				bcrypt.compare(password, rows[0].hash, (err, res) => {
					if (res) {
						// We have a valid user...pass them a signed JWT token
						const data = {
							passwordHash: rows[0].hash
						};
						const token = jwt.sign(data, process.env.JWT_SECRET, {
							expiresIn: 60*60*24
						});
						if (rows[0].verified) {
							done({
								user: {
									email: rows[0].email,
									name: rows[0].name
								},
								token,
								verified: true
							});
						} else {
							done({
								user: {
									email: rows[0].email,
									name: rows[0].name
								},
								token,
								verified: false
							});
						}
					} else {
						done({ valid: false }, invalidPasswordError);
					}
				});
			}
		});
};

const verifyUser = (hash, done) => {
	database
		.get()
		.query(`SELECT * FROM Verify WHERE vhash=?`, [hash], (err, rows) => {
			if (err) done(false, { error: err });
			else if (rows.length === 0) {
				done(false, { error: err });
			} else {
				const email = rows[0].email;
				database
					.get()
					.query(
						`UPDATE User SET verified=? WHERE email=?`,
						[true, email],
						(er, row) => {
							if (er) {
								done(false, { error: err });
							} else {
								database
									.get()
									.query(
										`DELETE FROM Verify WHERE email=?`,
										[email],
										(e, r) => {
											if (e) {
												done(false, { error: err });
											} else {
												done(true);
											}
										}
									);
							}
						}
					);
			}
		});
};

const resendVerification = (email, done) => {
	database
		.get()
		.query(`SELECT * FROM Verify WHERE email=?`, [email], (err, rows) => {
			if (err) {
				done(false, { error: err });
			} else {
				const { vhash } = rows[0];
				console.log(vhash);
				done(vhash);
			}
		});
};

module.exports = {
	newUser: newUser,
	validateUser: validateUser,
	verifyUser: verifyUser,
	resendVerification,
	resendVerification
};
