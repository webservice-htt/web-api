var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var CourseSchema = require('../models/course');
var LessonSchema = require('../models/lesson');
var Course = mongoose.model('Course', CourseSchema);
var Lesson = mongoose.model('Lesson', LessonSchema);

/* GET users listing. */
router.get('/', function(req, res, next) {
  	Course.find({})
  		  .populate('lessons')
  		  .exec(function (err, courses) {
  		  	console.log(err, courses)
			if (err || !courses){
					return res.json({statuscode : 404,results : 'Courses not found'});
				} else {
					return res.json({statuscode : 200,results : courses});
				}
			});
});

router.get('/:courseId', function(req, res, next) {
	res.json({statuscode : 200,results:req.course});
});


router.post('/', function(req, res, next) {
	var user;
	var image = req.body.image ? req.body.image.trim() : '';
	var tenKH = req.body.tenKH ? req.body.tenKH.trim() : '';
	var description = req.body.description ? req.body.description.trim() : '';
	var lessons = req.body.lessons ? req.body.lessons : [];	
	
	var course = new Course(req.body);
	course.lessons = [];
    for(let i in lessons) {
		var lesson = new Lesson(lessons[i])
		lesson.save((error) => {
			if (error) {
				console.log(error, " Loi")
				return res.json({statuscode : 404,results : 'Error'}); 
			}
		})	
		course.lessons.push(lesson)
		
	}
	course.save(function(error) {
		if (error) {
				console.log(error, " Loi")
				return res.json({statuscode : 404,results : 'Error'}); 
			}
		else return res.json({statuscode : 200,results : course});
	});
});

router.put('/:courseId', function(req, res, next) {
	var user;
	var image = req.body.image ? req.body.image.trim() : '';
	var tenKH = req.body.tenKH ? req.body.tenKH.trim() : '';
	var description = req.body.description ? req.body.description.trim() : '';
	var lessons = req.body.lessons ? req.body.lessons : [];	
	
	var course = req.course

	if (image != '') course.image = image 
	if (tenKH != '') course.tenKH = tenKH 
	if (description != '') course.description = description 
	if (lessons.count > 0) {
	    for(let i in lessons) {
			var lesson = new Lesson(lessons[i])
			lesson.save((error) => {
				if (error) {
					console.log(error, " Loi")
					return res.json({statuscode : 404,results : 'Error'}); 
				}
			})	
			course.lessons.push(lesson)
			
		}
	}
	course.save(function(error) {
		if (error) {
			console.log(error, " Loi")
			return res.json({statuscode : 404,results : 'Error'}); 
		}
		else return res.json({statuscode : 200,results : course});
	});
});

router.delete('/:courseId', function(req, res, next) {
	var course = req.course
	course.remove(err => {
		if (!err) {
			return res.json({statuscode : 200,results : 'Success'});
		} else {
			console.log(err);
			return res.json({statuscode : 404,results : 'Courses not found'});
		}
	})
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  	Course.find({})
  		  .populate('lessons')
  		  .exec(function (err, courses) {
  		  	console.log(err, courses)
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
                Lesson.remove({}, function(err2) {
			            if (err2) {
			                console.log(err2)
			            } else {
			                create()
			            }
			        }
			    );
            }
        }
    );
	function create() {
		let courses = ["C++", "C#", "Java", "Web", "Android", "iOS"]
		let images = {}
		images["C++"] = "https://toidammeit.files.wordpress.com/2016/07/499292_1aeb_2.jpg?w=750";
		images["C#"] = "https://giabaoit.com/wp-content/uploads/2017/12/c-sharp-680x380.jpg";
		images["Java"] = "https://giabaoit.com/wp-content/uploads/2018/01/lap-trinh-java-651x380.jpg";
		images["Web"] = "http://vnskills.com/hinhanh/images/lap-trinh-vien-android.png";
		images["Android"] = "http://vnskills.com/hinhanh/images/lap-trinh-vien-android.png";
		images["iOS"] = "http://vnskills.com/hinhanh/images/lap-trinh-vien-android.png";

		let course
		let lessons = {}
		lessons["C++"] = lessons["C#"] = lessons["Java"] = lessons["Web"] = lessons["Android"] = lessons["iOS"] = [
			{
				tenBH : "Bài 1 - Giới thiệu ngôn ngữ và Visual Studio",
				url : "https://www.youtube.com/watch?v=jrn6bXC6sTU&index=1&list=PLRlbFp7jBO4IwyRIILcX1zacu7T5J2v39"
			},
			{
				tenBH : "Bài 2 - Hello World",
				url : "https://www.youtube.com/watch?v=1PqxYZ6RSOU&index=2&list=PLRlbFp7jBO4IwyRIILcX1zacu7T5J2v39"
			},
			{
				tenBH : "Bài 3 - Hello world (phần 2)",
				url : "https://www.youtube.com/watch?v=Wrk0CvqkA8I&index=3&list=PLRlbFp7jBO4IwyRIILcX1zacu7T5J2v39"
			},
			{
				tenBH : "Bài 4 - Biến và kiểu dữ liệu",
				url : "https://www.youtube.com/watch?v=_XLLDzum4yw&index=4&list=PLRlbFp7jBO4IwyRIILcX1zacu7T5J2v39"
			},
			{
				tenBH : "Bài 5 - CIN (phần 1)",
				url : "https://www.youtube.com/watch?v=Yon_Bj72nGI&list=PLRlbFp7jBO4IwyRIILcX1zacu7T5J2v39&index=5"
			}

		]
		console.log(lessons)
		for (let i of courses) {
			course = new Course();
			// course.tenKH = "Lập trình " + i;
			course.lessons = []
			course.image = images[i]
			for(let j in lessons[i]) {
				var lesson = new Lesson(lessons[i][j])
				lesson.tenBH = i + " : " + lesson.tenBH
				lesson.save((error) => {
					if (error) console.log(error, " Loi")
				})	
				course.lessons.push(lesson)
				
			}
			// course.lessons = lessons[i];
			course.tenKH = "Lap Trinh " + i;
			// course.description = "Bạn sẽ được trải nghiệm khóa học lập trình " + i + " với đội ngũ giáo viên cực chuyên nghiệp"
			course.description = "Khoa hoc " + i + " voi doi ngu chuyen nghiep hon bao gio het"
			course.save((error) => {
				if (error) console.log(error, " Loi")
			})
		}
	}
}

router.param('courseId', function (req, res, next) {
	var id = req.params.courseId;
	console.log(mongoose.Types.ObjectId(id))
	Course.findOne({
			_id : mongoose.Types.ObjectId(id)
		}) 
		.populate('lessons')
		.exec(function (err, course) {
			console.log(err, course)
			if (err || !course){
				return res.json({statuscode : 404,results : 'Course was not found'});
			} else {
				req.course = course;
				next();
			}
		});
});

module.exports = router;
