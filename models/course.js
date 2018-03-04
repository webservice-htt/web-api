var mongoose = require('mongoose');
var	Schema = mongoose.Schema;

let Course = new Schema({
	tenKH : String,
	description : String,
	image : String,
	lessons : [{
		type : Schema.Types.ObjectId,
		ref : 'Lesson'
	}],
	fee : Number,
	status : Boolean

},{
	versionKey : false
});



Course.methods ={
	toJSON: function() {
		var obj = this.toObject();
		return obj;
	}
}


module.exports = Course;