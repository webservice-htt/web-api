var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var CourseSchema = require('../models/course');
var CategorySchema = require('../models/category');

var Course = mongoose.model('Course', CourseSchema);
var Category = mongoose.model('Category', CategorySchema);

/* GET users listing. */
router.get('/', function(req, res, next) {
  	Category.find({})
  		  .populate('course')
  		  .exec(function (err, category) {
  		  	console.log(err, category)
			if (err || !category){
					return res.json({statuscode : 404,results : {}});
				} else {
					return res.json({statuscode : 200,results : category});
				}
			});
});

router.get('/:categoryId', function(req, res, next) {
	res.json({statuscode : 200,results:req.category});
});


router.post('/', function(req, res, next) {
	var name = req.body.name ? req.body.name.trim() : '';
	
	var category = new Category(req.body);
	category.course = [];
	category.save(function(error) {
		if (error) {
			return res.json({statuscode : 404,results : {}}); 
		} else return res.json({statuscode : 200,results : category});
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

router.delete('/:categoryId', function(req, res, next) {
	var category = req.category
	category.remove(err => {
		if (!err) {
			return res.json({statuscode : 200,results : 'Success'});
		} else {
			return res.json({statuscode : 404,results : {}});
		}
	})
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  	Category.find({})
  		  .populate('course')
  		  .exec(function (err, categoies) {
			if (err || !categoies){
					return res.json({statuscode : 404,results : {}});
				} else {
					return res.json({statuscode : 200,results : categoies});
				}
			});
});

router.param('categoryId', function (req, res, next) {
	var id = req.params.categoryId;
	Category.findOne({
			_id : mongoose.Types.ObjectId(id)
		}) 
		.populate('course')
		.exec(function (err, category) {
			if (err || !category){
				return res.json({statuscode : 404,results : {}});
			} else {
				req.category = category;
				next();
			}
		});
});

module.exports = router;
