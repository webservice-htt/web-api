var mongoose = require('mongoose');
var	Schema = mongoose.Schema;

let Category = new Schema({
	name : String,
	course : [{
		type : Schema.Types.ObjectId,
		ref : 'Course'
	}]
},{
	versionKey : false
});



Category.methods ={
	toJSON: function() {
		var obj = this.toObject();
		return obj;
	}
}

module.exports = Category;