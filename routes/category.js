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
	var course = req.body.course ? req.body.course : [];
	var category = req.category

	if (name != '') course.name = name 
	else res.json({statuscode : 404,results : {}});

	var category = new Category(req.body);
	category.course = [];

	if (course.length > 0) {
	    for(let i in course) {
			category.course.push(course[i])
		}
	}

	category.save(function(error) {
		if (error) {
			return res.json({statuscode : 404,results : {}}); 
		} else return res.json({statuscode : 200,results : category});
	});
});

router.put('/:categoryId', function(req, res, next) {
	var name = req.body.name ? req.body.name.trim() : '';
	var course = req.body.course ? req.body.course : [];
	var category = req.category

	if (name != '') course.name = name 
	if (course.length > 0) {
	    for(let i in course) {
			category.course.push(course[i])
		}
	}
	category.save(function(error) {
		if (error) {
			return res.json({statuscode : 404,results : {}}); 
		}
		else {
			category.populate({ path : "course", model : "Course"}, (err, categoryPopulated) => {
				if (err) {
					return res.json({statuscode : 404,results : {}}); 
				} else {
					return res.json({statuscode : 200,results : categoryPopulated});
				}
			});
		}
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

	Category.findOne({ _id : id }) 
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
