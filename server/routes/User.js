const User = require('../models/users/User');
const Admin = require('../models/users/Admin');
const Owner = require('../models/users/Owner');
const { requireLogin } = require('./middleware/requireLogin');


module.exports = (app) => {

    app.post('/api/new_user', (req, res) => {
        const { name, email, password, } = req.body;
        console.log(req.body);
        User.newUser(name, email, password, (result, err) => { 
            if (err) {
                res.send(err);
            } else {
                res.send('success');
            }
         });
    });

    app.post('/api/new_admin', (req, res) => {
        const { name, email, password, } = req.body;
        Admin.newAdmin(name, email, password, (result, err) => { 
            if (err) {
                res.send(err);
            } else {
                res.send('success');
            }
         });
    });

    app.post('/api/new_owner', (req, res) => {
        const { name, email, password, } = req.body;
        Owner.newOwner(name, email, password, (result, err) => { 
            if (err) {
                res.send(err);
            } else {
                res.send('success');
            }
         });
    });

    app.post('/api/login', (req, res) => {
        const { email, password, } = req.body;
        User.validateUser(email, password, (result, err) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        })
    });

    app.post('/api/test', requireLogin, (req, res) => {
        console.log('************* begin token');
        console.log(req.body.token);
        console.log('************** End token');
        res.send(req.body);
    });
}