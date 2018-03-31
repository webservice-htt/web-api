var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var CourseSchema = require('../models/course');
var LessonSchema = require('../models/lesson');
var UserSchema = require('../models/user');
var CourseStatusSchema = require('../models/course_status');
var CategorySchema = require('../models/category');

var Course = mongoose.model('Course', CourseSchema);
var Lesson = mongoose.model('Lesson', LessonSchema);
var User = mongoose.model('User', UserSchema);
var CourseStatus = mongoose.model('CourseStatus', CourseStatusSchema);
var Category = mongoose.model('Category', CategorySchema);

/* GET users listing. */
router.get('/', function(req, res, next) {
  	Course.find({})
  		  .populate('lessons')
  		  .exec(function (err, courses) {
  		  	console.log(err, courses)
			if (err || !courses){
					return res.json({statuscode : 404,results : {}});
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
				return res.json({statuscode : 404,results : {}}); 
			}
		})	
		course.lessons.push(lesson)
		
	}
	course.save(function(error) {
		if (error) {
				console.log(error, " Loi")
				return res.json({statuscode : 404,results : {}}); 
			}
		else return res.json({statuscode : 200,results : course});
	});
});


router.post('/:courseId', function(req, res, next) {
	var userEmail = req.body.userEmail ? req.body.userEmail.trim() : '';
	var course = req.course
	User.findOne({ email : userEmail })
  		  .exec(function (err, user) {
			if (err || !user){
					return res.json({statuscode : 404,results : {}});
				} else {
					var cs = new CourseStatus()
					cs.courseId = course._id
					cs.save();
					var courses = user.course
					courses.push(cs)
					user.course = courses
					user.save(err => {
						console.log(err)
						if (!err) {
							res.json({statuscode : 200,results : user});
						} else {
							res.json({statuscode : 404,results : {}});
						}
					})
				}
			});
});


router.get('/active/:courseStatusId', function(req, res, next) {

	CourseStatus.findOne({ _id : req.params.courseStatusId })
  		  .exec(function (err, cs) {
			if (err || !cs){
					return res.json({statuscode : 404,results : {}});
				} else {
					cs.status = 1
					cs.save(err => {
						console.log(err)
						if (!err) {
							res.json({statuscode : 200,results : cs});
						} else {
							res.json({statuscode : 404,results : {}});
						}
					})
				}
			});
});

router.put('/:courseId', function(req, res, next) {
	var user;
	var image = req.body.image ? req.body.image.trim() : '';
	var tenKH = req.body.tenKH ? req.body.tenKH.trim() : '';
	var fee = req.body.fee ? req.body.fee.trim() : '';
	var link = req.body.link ? req.body.link.trim() : '';
	var description = req.body.description ? req.body.description.trim() : '';
	var lessons = req.body.lessons ? req.body.lessons : [];	
	
	var course = req.course

	if (image != '') course.image = image 
	if (tenKH != '') course.tenKH = tenKH 
	if (description != '') course.description = description 
	if (fee != '') course.fee = fee 
	if (link != '') course.link = link 
	if (lessons.length > 0) {
	    for(let i in lessons) {
			var lesson = new Lesson(lessons[i])
			lesson.save((error) => {
				if (error) {
					console.log(error, " Loi")
					return res.json({statuscode : 404,results : {}}); 
				}
			})	
			course.lessons.push(lesson)
			
		}
	}
	course.save(function(error) {
		if (error) {
			console.log(error, " Loi")
			return res.json({statuscode : 404,results : {}}); 
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
			return res.json({statuscode : 404,results : {}});
		}
	})
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  	Course.find({})
  		  .populate('lessons')
  		  .exec(function (err, courses) {
			if (err || !courses){
					return res.json({statuscode : 404,results : {}});
				} else {
					return res.json({statuscode : 200,results : courses});
				}
			});
});

// createCourse()

function createCourse() {
	console.log("createCourse")
	Course.remove({}, function(err) {
            if (err) {
                console.log(err)
            } else {
                Lesson.remove({}, function(err2) {
			            if (err2) {
			                console.log(err2)
			            } else {
			                Category.remove({}, err => {
			                	let categories = ["Tieng Thai", "Office365", "Lap Trinh", "Tieng Anh", "Tieng Nhat", "Tieng Han", "Nau An", "Su dung Photoshop"]
							    for (var i in categories) {
							    	create(categories[i])
							    }
			                })
			            }
			        }
			    );
            }
        }
    );
    
	function create(categoryName) {
		var category = new Category()
		category.name = categoryName

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
			category.course.push(course._id)
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
			course.fee = "800000"
			// course.description = "Bạn sẽ được trải nghiệm khóa học lập trình " + i + " với đội ngũ giáo viên cực chuyên nghiệp"
			course.description = "Khoa hoc " + i + " voi doi ngu chuyen nghiep hon bao gio het"
			course.save((error) => {
				if (error) console.log(error, " Loi")
				
			})
		}
		category.save()
	}
}

router.param('courseId', function (req, res, next) {
	var id = req.params.courseId;
	Course.findOne({
			_id : mongoose.Types.ObjectId(id)
		}) 
		.populate('lessons')
		.exec(function (err, course) {
			if (err || !course){
				return res.json({statuscode : 404,results : {}});
			} else {
				req.course = course;
				next();
			}
		});
});

module.exports = router;
