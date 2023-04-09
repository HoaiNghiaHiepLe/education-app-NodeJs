const Course = require('../models/Course');

class MeController {
  // [GET] /me/stored/courses
  storedCourses(req, res, next) {
    Course.find({})
      .lean()
      .then(courses =>
        res.render('stored-courses', {
          courses,
        }),
      )
      .catch(next);
  }
}

module.exports = new MeController();
