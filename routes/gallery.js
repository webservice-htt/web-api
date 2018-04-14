var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var GallerySchema = require('../models/gallery');
var Gallery = mongoose.model('Gallery',GallerySchema);

/* GET users listing. */
router.get('/', function(req, res, next) {
  	Gallery.find({})
  		  .exec(function (err, gallery) {
			if (err || !gallery){
					return res.json({statuscode : 404,results : {}});
				} else {
					return res.json({statuscode : 200,results : gallery});
				}
			});
});

router.get('/:galleryId', function(req, res, next) {
	res.json({statuscode : 200,results:req.gallery});
});


router.post('/', function(req, res, next) {
	var name = req.body.name ? req.body.name.trim() : '';
	var url = req.body.url ? req.body.url.trim() : '';
	var description = req.body.description ? req.body.description.trim() : '';
	if (name == '' || url == '' || description == '')
		return res.json({statuscode : 404,results : {}});

	var gallery = new Gallery(req.body);
	gallery.save(function(error) {
		if (error) {
			return res.json({statuscode : 404,results : {}}); 
		} else return res.json({statuscode : 200,results : gallery});
	});
});

router.put('/:galleryId', function(req, res, next) {
	var gallery = req.gallery
	var name = req.body.name ? req.body.name.trim() : '';
	var url = req.body.url ? req.body.url.trim() : '';
	var description = req.body.description ? req.body.description.trim() : '';

	if (name != '') req.gallery.name = name;
	if (url != '') req.gallery.url = url;
	if (description != '') req.gallery.description = description;
	

	gallery.save(function(error) {
		if (error) {
			return res.json({statuscode : 404,results : {}}); 
		}
		else {
			return res.json({statuscode : 200,results : gallery});
		}
	});
});

router.delete('/:galleryId', function(req, res, next) {
	var gallery = req.gallery
	gallery.remove(err => {
		if (!err) {
			return res.json({statuscode : 200,results : 'Success'});
		} else {
			return res.json({statuscode : 404,results : {}});
		}
	})
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  	Gallery.find({})
  		  .populate('course')
  		  .exec(function (err, galleries) {
			if (err || !galleries){
					return res.json({statuscode : 404,results : {}});
				} else {
					return res.json({statuscode : 200,results : galleries});
				}
			});
});

router.param('galleryId', function (req, res, next) {
	var id = req.params.galleryId;
	Gallery.findOne({
			_id : mongoose.Types.ObjectId(id)
		}) 
		.populate('course')
		.exec(function (err, gallery) {
			if (err || !gallery){
				return res.json({statuscode : 404,results : {}});
			} else {
				req.gallery = gallery;
				next();
			}
		});
});

module.exports = router;
