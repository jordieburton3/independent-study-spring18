const { database } = require('../../helpers/database/db');
const { noPrivilegeError } = require('../../models/courses/errors');

const requireAdminPrivilege = (req, res, next) => {
    const { owner, courseInfo } = req.body;
    database.get().query(`SELECT * FROM Course WHERE id=?`, [courseInfo.id], (err, rows) => {
        const record = rows[0];
        const admins = JSON.parse(record.admins);
        if (record.owner == owner || admins.includes(owner)) {
            next();
        } else {
            res.send({ error: noPrivilegeError });
        }
    })
}

module.exports = {
	requireAdminPrivilege
};
