const { database } = require('../../helpers/database/db');
const { noPrivilegeError } = require('../../models/courses/errors');

const requireOwnerPrivilege = (req, res, next) => {
    const { sender, courseInfo } = req.body;
    database.get().query(`SELECT * FROM Course WHERE id=?`, [courseInfo.id], (err, rows) => {
        const record = rows[0];
        if (record.owner == sender) {
            next();
        } else {
            res.send({ errors: [noPrivilegeError] });
        }
    })
}

module.exports = {
	requireOwnerPrivilege
};
