var mongoose = require('mongoose');
var	Schema = mongoose.Schema;

let Gallery = new Schema({
	name : String,
	url : String,
	description : String

},{
	versionKey : false
});



Gallery.methods ={
	toJSON: function() {
		var obj = this.toObject();
		return obj;
	}
}


module.exports = Gallery;