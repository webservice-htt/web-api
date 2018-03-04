var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var async = require('async');
var UserSchema = require('../models/user');
var User = mongoose.model('User', UserSchema);

var CourseSchema = require('../models/course');
var Course = mongoose.model('Course', CourseSchema);

var regexmail = /^[A-z0-9_\.]{4,31}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/;

/* GET users listing. */
router.get('/', function(req, res, next) {
  	User.find({}, function (err, users) {
		if (err || !users){
			return res.json({statuscode : 404,results : 'Users not found'});
		} else {
			return res.json({statuscode : 200,results : users});
		}
	});
});

router.get('/:userId', function(req, res, next) {
	res.json({statuscode : 200,results:req.user});
});

router.post('/login', function (req, res, next) {
	var user;
	var email = req.body.email ? req.body.email.trim() : '';
	var password = req.body.password ? req.body.password.trim() : '';	
	if (!regexmail.test(email)){
		return res.json({statuscode : 404,results:'email is invalid'});
	}
	else {
		User.findOne({
			email : email
		}, function (err, user) {
			if (err || !user){
				return res.json({statuscode : 404,results : 'user was not found'});
			} else {
				if (user.authenticate(password.toString())) {
					// return res.json({statuscode : 200,results:user});
					return res.json({statuscode : 200,results:user});
				} else {
					return res.json({statuscode : 404,results:'wrong password'});
				}
			}
		});
	}
});

router.post('/register', function(req, res, next){
	var email = req.body.email ? req.body.email.trim() : '';
	var password = req.body.password ? req.body.password.trim() : '';
	var name = req.body.name ? req.body.name.trim() : '';
	var user;

	async.series({
		checkFields : function (callback) {
			if (!email) {
				return callback('email is require');
			} else if (!password) {
				return callback('password is require');
			} else {
				if (!regexmail.test(email)) {
					return callback('email is invalid');
				} else {
					User.findOne({
						email : email
					}, function (err, user) {
						if (user) {
							return callback('email existed')
						} else if (err) {
							return callback(err);
						} else {
							callback();
						}
					});
				}
			}
		},
		createUser : function(callback) {
			user = new User(req.body);
			user.password = req.body.password;
			user.save(function(error) {
				if (error) callback(error);
				else callback();
			})
		}
	}, function (err, results) {
		if (err) {
			res.json({statuscode : 404,results:err});
		} else {
			res.json({statuscode : 200,results:user});
		}	
	});
});

router.post('/:userId/course', function (req, res, next) {
	var user = req.user;
	var course = req.body.course
	if (course && course.length > 0) {
		user.course = course
		user.save((err) => {
			if (err) {
				res.json({statuscode : 404,results:'course is require'});
			} else {
				Course.populate(user, {path:"course"}, function(err, u) { 
					if (err) res.json({statuscode : 404,results:'populate error'});
					else res.json({statuscode : 200,results:u});
				});
				
			}
		})
	}
});

createUser()

function createUser() {
	User.remove({}, function(err) {
            if (err) {
                console.log(err)
            } else {
                create()
            }
        }
    );
	function create() {
		var names = ["Duc", "Hung", "Tuan", "Long", "Trang"]
		let user
		for (let i of names) {
			user = new User();
			user.name = i
			user.password = "123";
			user.email = i + "@ptit.edu.vn"
			user.birthday = "11/11/1996"
			user.course = []
			if (i == "Long") user.role = 1
			if (i == "Trang") user.gender = true

			user.save((error) => {
				if (error) console.log(error, " Loi")
			})
		}
	}
}

router.param('userId', function (req, res, next) {
	var id = req.params.userId;
	User.findOne({
		_id : id
	}, function (err, user) {
		if (err || !user){
			return res.json({statuscode : 404,results : 'User was not found'});
		} else {
			req.user = user;
			next();
		}
	});
});

module.exports = router;
