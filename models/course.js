var mongoose = require('mongoose');
var	Schema = mongoose.Schema;

let Course = new Schema({
	tenKH : String,
	description : String
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