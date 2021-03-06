require('dotenv').config();
const { requireLogin } = require('./middleware/requireLogin');
const {
	newCourse,
	getCourseDetails,
	getAllUserCourses,
    addCourseToUser,
    addUserToCourse,
    addAdminToCourse,
    newUsers,
    newAdmins,
    setUserCourses,
    newPost,
    getPosts,
    getPermission
} = require('../models/courses/Course');
const { cantAddOwnerError } = require('../models/courses/errors');

const { requireOwnerPrivilege } = require('./middleware/requireOwnerPrivilege');
const { requireAdminPrivilege } = require('./middleware/requireAdminPrivilege');
const { requireUserPrivilege } = require('./middleware/requireUserPrivilege');

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
				});
			}
		});
	});

	app.post('/api/fetch_course', requireLogin, (req, res) => {
		const { id } = req.body;
		getCourseDetails(id, course => {
			res.send(course);
		});
	});

	app.post('/api/fetch_all_courses', requireLogin, (req, res) => {
		const { user } = req.body;
		getAllUserCourses(user, (courses, err) => {
			if (err) {
				res.send({ err });
			} else {
				res.send(courses);
			}
		});
    });
    
    app.post('/api/join_as_user', (req, res) => {
        const { user, courseInfo } = req.body;
        addUserToCourse(user, courseInfo, (result, error) => {
            res.send(result);
        });
    });

    app.post('/api/join_as_admin', (req, res) => {
        //console.log(req.body);
        const { user, courseInfo } = req.body;
        //console.log(user);
        addAdminToCourse(user, courseInfo, (result) => {
            if (error) {
                res.send(error);
            } else {
                res.send(result);
            }
        });
    });

    app.post('/api/change_to_user', requireLogin, requireOwnerPrivilege, (req, res) => {
        const { user, courseInfo } = req.body;
        addUserToCourse(user, courseInfo, (result, error) => {
            if (error) {
                res.send(error);
            } else {
                res.send(result);
            }
        });
    });

    app.post('/api/change_to_admin', requireLogin, requireOwnerPrivilege, (req, res) => {
        const { user, courseInfo } = req.body;
        addAdminToCourse(user, courseInfo, (result, error) => {
            if (error) {
                res.send(error);
            } else {
                res.send(result);
            }
        });
    });

    app.post('/api/add_as_user', requireAdminPrivilege, (req, res) => {
        const { users, courseInfo } = req.body;
        newUsers(users, courseInfo, (result, error) => {
            if (error) {
                res.send(error);
            } else {
                setUserCourses(result.validUsers, courseInfo);
                res.send(result);
            }
        });
    });

    app.post('/api/add_as_admin', requireOwnerPrivilege, (req, res) => {
        const { users, courseInfo } = req.body;
        newAdmins(users, courseInfo, (result, error) => {
            if (error) {
                res.send(error);
            } else {
                setUserCourses(result.validUsers, courseInfo);
                res.send(result);
            }
        });
    });

    app.post('/api/add_post', requireUserPrivilege, (req, res) => {
        const { courseInfo, sender, postInfo } = req.body;
        newPost(courseInfo, postInfo, (result => {
            if (result.error) {
                res.send({ error: result.error });
            } else {
                res.send(result);
            }
        }));
    });

    app.post('/api/get_posts', requireUserPrivilege, (req, res) => {
        const { courseInfo, sender, postInfo } = req.body;
        getPosts(courseInfo, (result) => {
            if (result.error) {
                res.send({ error: result.error });
            } else {
                res.send(result);
            }
        })
    });

    app.post('/api/get_permission', (req, res) => {
        const { sender, courseInfo } = req.body;
        getPermission(sender, courseInfo, (result, err) => {
            if (err) {
                res.send(err);
            } else {
                console.log(result);
                res.send(result);
            }
        })
    })
}
