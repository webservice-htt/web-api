var mongoose = require('mongoose');
var	Schema = mongoose.Schema;

let CourseStatus = new Schema({
	courseId : {
		type : Schema.Types.ObjectId,
		ref : 'Course'
	},
	status : {
		type: Number,
		default: 0
	}
},{
	versionKey : false
});



CourseStatus.methods ={
	toJSON: function() {
		var obj = this.toObject();
		return obj;
	}
}


module.exports = CourseStatus;