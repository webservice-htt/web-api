var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var CourseSchema = require('../models/course');
var Course = mongoose.model('Course', CourseSchema);

/* GET users listing. */
router.get('/', function(req, res, next) {
  	Course.find({}, function (err, courses) {
		if (err || !courses){
			return res.json({statuscode : 404,results : 'Courses not found'});
		} else {
			return res.json({statuscode : 200,results : courses});
		}
	});
});

// createCourse()

function createCourse() {
	Course.remove({}, function(err) {
            if (err) {
                console.log(err)
            } else {
                create()
            }
        }
    );
	function create() {
		let courses = ["C++", "C#", "Java", "Web", "Android", "iOS"]
		let course
		for (let i of courses) {
			course = new Course();
			// course.tenKH = "Lập trình " + i;
			course.tenKH = "Lap Trinh " + i;
			// course.description = "Bạn sẽ được trải nghiệm khóa học lập trình " + i + " với đội ngũ giáo viên cực chuyên nghiệp"
			course.description = "Khoa hoc " + i + " voi doi ngu chuyen nghiep hon bao gio het"
			course.save((error) => {
				if (error) console.log(error, " Loi")
			})
		}
	}
}

module.exports = router;
