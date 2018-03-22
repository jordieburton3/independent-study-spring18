const {
	MODE_PRODUCTION,
	MODE_TEST,
	PRODUCTION_DB,
	TEST_DB
} = require('../../helpers/database/constants');
const { database } = require('../../helpers/database/db');
uuid = require('uuid');
const { noCourseError } = require('./errors');


const newCourse = (title, description, creator, done) => {
    const admins = [];
    const users = [];
    const adminsJson = JSON.stringify(admins);
    const usersJson = JSON.stringify(users);
    const id = uuid();
    database.get().query(`INSERT INTO Course (id, title, description, owner, admins, users) VALUES (?, ?, ?, ?, ?, ?)`, 
        [id, title, description, creator, adminsJson, usersJson],
        (err, result) => {
            if (err) {
                done(null, null, err);
            } else {
                done(result, id, null);
            }
        });
}

const getCourseDetails = (id, done) => {
    database.get().query(`SELECT * FROM Course WHERE id=?`, [id], (err, rows) => {
        if (rows.length == 0) {
            done({}, noCourseError);
        } else {
            done(rows[0], null);
        }
    });
}

module.exports = {
    newCourse,
    getCourseDetails
}