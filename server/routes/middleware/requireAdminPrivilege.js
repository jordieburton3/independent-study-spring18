const { database } = require('../../helpers/database/db');
const { noPrivilegeError } = require('../../models/courses/errors');

const requireAdminPrivilege = (req, res, next) => {
    const { sender, courseInfo } = req.body;
    database.get().query(`SELECT * FROM Course WHERE id=?`, [courseInfo.id], (err, rows) => {
        const record = rows[0];
        const admins = JSON.parse(record.admins);
        if (record.owner == sender || admins.includes(sender)) {
            next();
        } else {
            res.send({ errors: [noPrivilegeError] });
        }
    })
}

module.exports = {
	requireAdminPrivilege
};
