var mongoose = require('mongoose');
var	Schema = mongoose.Schema;

let Lesson = new Schema({
	tenBH : String,
	description : String,
	url : String

},{
	versionKey : false
});



Lesson.methods ={
	toJSON: function() {
		var obj = this.toObject();
		return obj;
	}
}


module.exports = Lesson;