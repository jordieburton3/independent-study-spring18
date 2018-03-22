require('dotenv').config();
const { requireLogin } = require('./middleware/requireLogin');
const {
    newCourse,
    getCourseDetails
} = require('../models/courses/Course');


module.exports = app => {
    app.post('/api/new_course', (req, res) => {
        const { title, description, creator } = req.body;
        newCourse(title, description, creator, (result, id, error) => {
            const toSend = {
                title,
                description,
                creator,
                id
            }
            res.send(toSend);
        });
    });

    app.post('/api/fetch_course', (req, res) => {
        const { id } = req.body;
        getCourseDetails(id, (course) => {
            res.send(course);
        });
    })
}