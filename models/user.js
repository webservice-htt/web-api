var mongoose = require('mongoose');
var	Schema = mongoose.Schema;
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr';

var User = new Schema({
	name : String,
	role : {
		type: Number,
		default: 0
	},
	email : {
		type : String,
		unique : true
	},
	phone : String,
	birthday : String,
	gender : {
		type : Boolean,
		default : false
	},
	course : [{
		type : Schema.Types.ObjectId,
		ref : 'CourseStatus'
	}],
	hashed_password : String,
	salt : String
},{
	versionKey : false
});


User.virtual('password').set(function(password) {
  	this._password = password;
  	this.hashed_password = this.hashPassword(password);
}).get(function() {
  return this._password;
});

User.methods ={
	authenticate: function(plainText) {
    	return this.hashPassword(plainText) === this.hashed_password;
	},
	hashPassword: function(password) {
    	var cipher = crypto.createCipher(algorithm,password);
    	var crypted = cipher.update('Secret','utf8','hex')
		crypted += cipher.final('hex');
		return crypted;
	},
	toJSON: function() {
		var obj = this.toObject();
		delete obj.hashed_password;
		delete obj.salt;
		return obj;
	}
}


module.exports = User;