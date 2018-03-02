const User = require('../models/users/User');
const Admin = require('../models/users/Admin');
const Owner = require('../models/users/Owner');
require('dotenv').config();
const { requireLogin } = require('./middleware/requireLogin');
const {
	sqlError,
	jwtAuthError,
	jwtNotProvidedError
} = require('../helpers/errors');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: process.env.DEV_EMAIL,
		pass: process.env.DEV_PASSWORD
	}
});

const createHash = () => {
	let current_date = moment.now().toString();
	let random = Math.random().toString();
	return crypto
		.createHash('sha1')
		.update(`${current_date}${random}`)
		.digest('hex');
};

module.exports = app => {
	app.post('/api/new_user', (req, res) => {
		const { name, email, password } = req.body;
		const userHash = createHash();
		User.newUser(name, email, password, userHash, async (result, err) => {
			if (err) {
				res.send({
					error: err
				});
			} else {
				const protocol = req.protocol;
				const host = req.get('host');
				const mailOptions = {
					from: 'jordieburton3dev@gmail.com', // sender address
					to: [email], // list of receivers
					subject: 'Please verify your account', // Subject line
					html: `<div>Welcome to Jordan's Independent Study site! <br>Place make sure to verify your account with <a href="${protocol}://${host}/verify/${userHash}">this link<a></br></div>` // plain text body
				};
				await transporter.sendMail(mailOptions, (err, info) => {
					if (err) res.send(err);
					else {
						console.log(info);
						res.send(info);
					}
				});
			}
		});
	});

	app.post('/api/new_admin', (req, res) => {
		const { name, email, password } = req.body;
		Admin.newAdmin(name, email, password, (result, err) => {
			if (err) {
				res.send(err);
			} else {
				res.send('success');
			}
		});
	});

	app.post('/api/new_owner', (req, res) => {
		const { name, email, password } = req.body;
		Owner.newOwner(name, email, password, (result, err) => {
			if (err) {
				res.send(err);
			} else {
				res.send('success');
			}
		});
	});

	app.post('/api/login', (req, res) => {
		const { email, password } = req.body;
		User.validateUser(email, password, (result, err) => {
			jwt.verify(
				result.token,
				process.env.JWT_SECRET,
				{ complete: true },
				(error, decoded) => {
					if (err) {
						console.log('err 1');
						res.send({ errResponse: jwtAuthError });
					} else if (error) {
						console.log('err 2');
						res.send({ errResponse: error });
					} else {
						console.log('signing in');
						const data = {
							token: {
								user: result.user,
								encoded: result.token,
								iat: decoded.iat,
								exp: decoded.exp
							},
							verified: result.verified
						};
						res.send(data);
					}
				}
			);
		});
	});

	app.post('/api/verify', (req, res) => {
		const { hash } = req.body;
		console.log(hash);
		User.verifyUser(hash, (result, err) => {
			console.log(result);
			console.log(err);
			if (err) {
				res.send({ success: false });
			} else {
				res.send({ success: true });
			}
		});
	});

	app.post('/api/resend_verification', (req, res) => {
		const { email } = req.body;
		User.resendVerification(email, (result, err) => {
			if (err) {
				res.send(err);
			} else {
				res.send(result);
			}
		});
	});

	app.post('/api/test', requireLogin, (req, res) => {
		console.log('************* begin token');
		console.log(req.decoded);
		console.log('************** End token');
		res.send(req.body);
	});
};
