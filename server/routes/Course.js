require('dotenv').config();
const { requireLogin } = require('./middleware/requireLogin');
const {
    newCourse,
    getCourseDetails,
    getAllUserCourses,
    addCourseToUser
} = require('../models/courses/Course');


module.exports = app => {
    app.post('/api/new_course', requireLogin, (req, res) => {
        const { title, description, creator } = req.body;
        newCourse(title, description, creator, (result, id, err) => {
            if (err) {
                res.send({ err });
            } else {
                addCourseToUser(creator, { id, title }, () => {
                    const toSend = {
                        title,
                        description,
                        creator,
                        id
                    };
                    res.send(toSend);
                })
            }
        });
    });

    app.post('/api/fetch_course', requireLogin, (req, res) => {
        const { id } = req.body;
        getCourseDetails(id, (course) => {
            res.send(course);
        });
    });

    app.post('/api/fetch_all_courses', requireLogin, (req, res) => {
        const { user } = req.body;
        getAllUserCourses(user, (courses, err) => {
            if (err) {
                res.send({ err });
            }
            else {
                res.send(courses);
            }
        });
    });
}