const {
	MODE_PRODUCTION,
	MODE_TEST,
	PRODUCTION_DB,
	TEST_DB
} = require('../../helpers/database/constants');
const { database } = require('../../helpers/database/db');
uuid = require('uuid');
const {
	noCourseError,
	doesNotExistError,
	alreadyContainedError
} = require('./errors');

const uniqueArray = array =>
	array.filter((elem, pos) => {
		return array.indexOf(elem) == pos;
	});

const removeDups = (filteredList, sourceList) =>
	filteredList.filter((elem, post) => {
		return sourceList.indexOf(elem) == -1;
	});

const newCourse = (title, description, creator, done) => {
	const admins = [];
	const users = [];
	const posts = [];
	const adminsJson = JSON.stringify(admins);
	const usersJson = JSON.stringify(users);
	const postsJson = JSON.stringify(posts);
	const id = uuid();
	database
		.get()
		.query(
			`INSERT INTO Course (id, title, description, owner, admins, users, posts) VALUES (?, ?, ?, ?, ?, ?, ?)`,
			[id, title, description, creator, adminsJson, usersJson, postsJson],
			(err, result) => {
				if (err) {
					console.log(err)
					done(null, null, err);
				} else {
					done(result, id, null);
				}
			}
		);
};

const getCourseDetails = (id, done) => {
	database.get().query(`SELECT * FROM Course WHERE id=?`, [id], (err, rows) => {
		if (rows.length == 0) {
			done({}, noCourseError);
		} else {
			done(rows[0], null);
		}
	});
};

const getAllUserCourses = (user, done) => {
	database
		.get()
		.query(`SELECT * FROM User WHERE email=?`, [user], (err, rows) => {
			if (rows.length == 0) {
				done({}, noCourseError);
			} else {
				const courses = JSON.parse(rows[0].courses);
				done(courses);
			}
		});
};

const addCourseToUser = (user, courseInfo, done) => {
	database
		.get()
		.query(`SELECT * FROM User WHERE email=?`, [user], (err, rows) => {
			if (err) {
				console.log(err);
			}
			const record = rows[0];
			const courseArray = JSON.parse(record.courses);
			courseArray.push(courseInfo);
			const jsonArray = JSON.stringify(courseArray);
			database
				.get()
				.query(
					`UPDATE User SET courses=? WHERE email=?`,
					[jsonArray, user],
					(error, r) => {
						if (error) {
							console.log(error);
							done(null, { error });
						}
						done({ response: 'SUCCESS' });
					}
				);
		});
};

const removeElement = (index, list) => {
	list.splice(index, 1);
};

const adjustList = (list, user) => {
	const i = list.indexOf(user);
	//console.log(`${list}, ${user}, ${i}`);
	if (i != -1) {
		removeElement(i, list);
	}
};

const addUserToCourse = (user, courseInfo, done) => {
	database
		.get()
		.query(`SELECT * FROM Course WHERE id=?`, [courseInfo.id], (err, rows) => {
			if (err) {
				console.log(err);
			}
			const record = rows[0];
			if (record.owner == user) {
				done({ response: 'ALREADY EXISTS' });
			}
			const userArray = JSON.parse(record.users);
			if (!userArray.includes(user)) {
				userArray.push(user);
				const adminArray = JSON.parse(record.admins);
				adjustList(adminArray, user);
				const adjustedAdmins = JSON.stringify(adminArray);
				const jsonArray = JSON.stringify(userArray);
				database
					.get()
					.query(
						`UPDATE Course SET users=?, admins=? WHERE id=?`,
						[jsonArray, adjustedAdmins, courseInfo.id],
						(error, r) => {
							if (error) {
								console.log(error);
								done(null, { error });
							} else {
								done({ response: 'SUCCESS' });
							}
						}
					);
			} else {
				done({ response: 'ALREADY_EXISTS' });
			}
		});
};

const addAdminToCourse = (user, courseInfo, done) => {
	database
		.get()
		.query(`SELECT * FROM Course WHERE id=?`, [courseInfo.id], (err, rows) => {
			if (err) {
				console.log(err);
			}
			if (record.owner == user) {
				done({ response: 'ALREADY EXISTS' });
			}
			const record = rows[0];
			const adminArray = JSON.parse(record.admins);
			if (!adminArray.includes(user)) {
				adminArray.push(user);
				const userArray = JSON.parse(record.users);
				adjustList(userArray, user);
				//console.log(userArray);
				const adjustedUsers = JSON.stringify(userArray);
				const jsonArray = JSON.stringify(adminArray);
				database
					.get()
					.query(
						`UPDATE Course SET admins=?, users=? WHERE id=?`,
						[jsonArray, adjustedUsers, courseInfo.id],
						(error, r) => {
							if (error) {
								console.log(error);
								done(error);
							} else {
								done({});
							}
						}
					);
			} else {
				done({ response: 'ALREADY_EXISTS' });
			}
		});
};

const newUsers = (users, courseInfo, done) => {
	database.get().query(`SELECT * FROM User`, [], (errors, userRows) => {
		if (errors) {
			console.log(errors);
			done(null, { error: errors });
		} else {
			const validUsers = [];
			for (let i = 0; i < userRows.length; i++) {
				validUsers.push(userRows[i].email);
			}
			const invalidUsers = users.filter((elem, pos) => {
				return validUsers.indexOf(elem) == -1;
			});
			database
				.get()
				.query(
					`SELECT * FROM Course WHERE id=?`,
					[courseInfo.id],
					(err, rows) => {
						if (err) {
							console.log(err);
							done(null, { error: err });
						} else {
							const errors = [];
							const record = rows[0];
							const parsedUsers = JSON.parse(record.users);
							const adminArray = JSON.parse(record.admins);
							const userArray = users.filter((elem, pos) => {
								const isValid = validUsers.indexOf(elem) != -1;
								const isUnique =
									parsedUsers.indexOf(elem) == -1 &&
									adminArray.indexOf(elem) == -1 &&
									elem != record.owner;
								if (!isValid) {
									errors.push({ user: elem, error: doesNotExistError });
								} else if (!isUnique) {
									errors.push({ user: elem, error: alreadyContainedError });
								}
								return isValid && isUnique;
							});
							const combinedArray = [...userArray, ...parsedUsers];
							const userSet = uniqueArray(combinedArray);
							const adjustedAdmins = JSON.stringify(
								removeDups(adminArray, userSet)
							);
							const jsonArray = JSON.stringify(userSet);
							database
								.get()
								.query(
									`UPDATE Course SET users=?, admins=? WHERE id=?`,
									[jsonArray, adjustedAdmins, courseInfo.id],
									(error, r) => {
										payload = {
											invalidUsers,
											validUsers: userArray,
											errors: errors
										};
										if (error) {
											done(null, { error });
										} else {
											done(payload);
										}
									}
								);
						}
					}
				);
		}
	});
};

const newAdmins = (users, courseInfo, done) => {
	database.get().query(`SELECT * FROM User`, [], (errors, userRows) => {
		if (errors) {
			console.log(errors);
			done(null, { error: errors });
		} else {
			const validUsers = [];
			for (let i = 0; i < userRows.length; i++) {
				validUsers.push(userRows[i].email);
			}
			const invalidUsers = users.filter((elem, pos) => {
				return validUsers.indexOf(elem) == -1;
			});
			database
				.get()
				.query(
					`SELECT * FROM Course WHERE id=?`,
					[courseInfo.id],
					(err, rows) => {
						if (err) {
							console.log(err);
							done(null, { error: err });
						} else {
							const errors = [];
							const record = rows[0];
							const parsedAdmins = JSON.parse(record.admins);
							const userArray = JSON.parse(record.users);
							const adminArray = users.filter((elem, pos) => {
								const isValid = validUsers.indexOf(elem) != -1;
								const isUnique =
									parsedAdmins.indexOf(elem) == -1 &&
									userArray.indexOf(elem) == -1 &&
									elem != record.owner;
								if (!isValid) {
									errors.push({ user: elem, error: doesNotExistError });
								} else if (!isUnique) {
									errors.push({ user: elem, error: alreadyContainedError });
								}
								return isValid && isUnique;
							});
							const combinedArray = [...adminArray, ...parsedAdmins];
							const adminSet = uniqueArray(combinedArray);
							const adjustedUsers = JSON.stringify(
								removeDups(userArray, adminSet)
							);
							const jsonArray = JSON.stringify(adminSet);
							database
								.get()
								.query(
									`UPDATE Course SET users=?, admins=? WHERE id=?`,
									[adjustedUsers, jsonArray, courseInfo.id],
									(error, r) => {
										payload = {
											invalidUsers,
											validUsers: adminArray,
											errors: errors
										};
										if (error) {
											done(null, { error });
										} else {
											done(payload);
										}
									}
								);
						}
					}
				);
		}
	});
};

const setUserCourse = async (user, courseInfo) => {
	return new Promise((resolve, reject) => {
		database
			.get()
			.query(`SELECT * FROM User WHERE email=?`, [user], (err, rows) => {
				if (err) {
					reject(err);
				} else {
					const record = rows[0];
					const courses = JSON.parse(record.courses);
					courses.push(courseInfo);
					const jsonArray = JSON.stringify(courses);
					database
						.get()
						.query(
							`UPDATE User SET courses=? WHERE email=?`,
							[jsonArray, user],
							(error, r) => {
								if (error) {
									reject(error);
								} else {
									resolve(r);
								}
							}
						);
				}
			});
	});
};

const setUserCourses = async (users, courseInfo) => {
	for (let i = 0; i < users.length; i++) {
		await setUserCourse(users[i], courseInfo);
	}
};

const newPost = (courseInfo, postInfo, done) => {
	database.get().query(`SELECT * from Course WHERE id=?`, [courseInfo.id], (err, rows) => {
		if (err) {
			done({ error: err });
		} else {
			const record = rows[0];
			const posts = JSON.parse(record.posts);
			posts.push(postInfo);
			const jsonPosts = JSON.stringify(posts);
			database.get().query(`UPDATE Course SET posts=? WHERE id=?`, [jsonPosts, courseInfo.id], (error, r) => {
				if (error) {
					done({ error });
				} else {
					done({ success: "POST_SUCCESS" });
				}
			});
		}
	});
}

const getPosts = (courseInfo, done) => {
	database.get().query(`SELECT * FROM Course WHERE id=?`, [courseInfo.id], (err, rows) => {
		if (err) {
			done({ error: err });
		} else {
			const record = rows[0];
			done({ posts: JSON.parse(record.posts) });
		}
	})
}

const getPermission = (user, courseInfo, done) => {
	database.get().query(`SELECT * FROM Course WHERE id=?`, [courseInfo.id], (err, rows) => {
        const record = rows[0];
		const admins = JSON.parse(record.admins);
		console.log(user);
        if (record.owner == user) {
            done({ permission: 'owner'}, undefined);
        } else if(admins.includes(user)) {
			done({ permission: 'admin'}, undefined);
		} else {
            done({ permission: '' }, undefined);
        }
    });
}

module.exports = {
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
};
