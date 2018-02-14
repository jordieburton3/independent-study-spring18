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
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.DEV_EMAIL,
        pass: process.env.DEV_PASSWORD
    }
});

const createHash = () => {
	let current_date = moment.now().toString();
	let random = Math.random().toString();
	return crypto.createHash('sha1').update(`${current_date}${random}`).digest('hex');
}

module.exports = app => {
	app.post('/api/new_user', (req, res) => {
		const { name, email, password } = req.body;
		console.log(req.body);
		const userHash = createHash();
		User.newUser(name, email, password, (result, err) => {
			if (err) {
				res.send({
					error: err
				});
			} else {
				const mailOptions = {
					from: 'jordieburton3dev@gmail.com', // sender address
					to: 'jordieburton3@gmail.com', // list of receivers
					subject: 'Subject of your email', // Subject line
					html: `<p>${userHash}</p>`// plain text body
				  };
				transporter.sendMail(mailOptions, (err, info) => {
					if(err)
						console.log(err);
					else
						console.log(info);
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
							}
						};
						res.send(data);
					}
				}
			);
		});
	});

	app.post('/api/test', requireLogin, (req, res) => {
		console.log('************* begin token');
		console.log(req.decoded);
		console.log('************** End token');
		res.send(req.body);
	});
};
