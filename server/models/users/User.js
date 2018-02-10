const { MODE_PRODUCTION, MODE_TEST, PRODUCTION_DB, TEST_DB } = require('../../helpers/database/constants');
const { database } = require('../../helpers/database/db');
const { hashingError, noUserError, emailValidationError, passwordValidationError, invalidPasswordError } = require('./errors');
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

const newUser = (name, email, password, done, privilege) => {
    const errors = {};
    if (!passwordValidator.validate(password)) {
      errors.passwordValidationError = passwordValidationError;
    } if (!emailValidator.validate(email)) {
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
              `INSERT INTO User (name, email, hash, privilege) values (?, ?, ?, ?)`,
              [name, email, hash, permission],
              (err, result) => {
                done({}, err);
              }
            );
        }
      });
    } else {
      done({}, errors);
    }
  };
  
const validateUser = (email, password, done) => {
    database.get().query(`SELECT * FROM User WHERE email=?`, [email], (err, rows) => {
      if (err) done(false, err);
      else if (rows.length === 0) {
        done({}, noUserError);
      } else {
        bcrypt.compare(password, rows[0].hash, (err, res) => {
          if (res) {
            // We have a valid user...pass them a signed JWT token
            const data = {
              passwordHash: rows[0].hash
            }
            const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: 15 });
            done({
              user: {
                email: rows[0].email,
                name: rows[0].name,
              },
              token,
            });
          } else {
            done({ valid: false }, invalidPasswordError);
          }
        });
      }
    });
  };

  module.exports = {
    newUser: newUser,
    validateUser: validateUser
  }