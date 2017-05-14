var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
	email:{
		type: String,
		unique: true,
		require: true
	},
	username:{
		type: String,
		unique: true,
		require: true
	},
	password:{
		type: String,
		bcrypt: true
	},
	avatar:{
		type: String
	},
	role:{// giasu, phhs, admin
		type: String,
		require:true
	},
	active: { // biet user da active chua
		type: Boolean,
		default: false
	},
	vipham:{ // nguoi dung co vipham > 3 -> cam login
		type:Number,
		default: 0
	},
	resettoken:{type:String},
	created_at: {
		type: Date,
		default: Date.now
	}
});

// ma hoa mat khau truoc khi save vao csdl
userSchema.pre('save', function(next){
	var user = this;
	bcrypt.hash(user.password, 10, function(err, hash){
		if(err) return next(err);
		user.password = hash;
		next();
	});
});

var User = module.exports = mongoose.model('User', userSchema);

// update user by query
module.exports.updateUserByQuery = function(query, value, callback){
	User.update(query, {$set:value}, callback);
}

// update user by id
module.exports.updateUser = function(id, value, callback){
	User.findByIdAndUpdate(id, {$set: value}, callback);
}
// get user info by username
module.exports.getUserByUsername = function(username, callback){
	User.findOne({username: username}, callback);
}
// find user by email or username
module.exports.getUserToLogin = function(value, callback){
	User.findOne({$or: [{'username': value}, {'email': value}]}, callback);
}
// get user info by user id
module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}
// so sanh mat khau
module.exports.comparePassword = function(reqpassword, hash, callback){
	bcrypt.compare(reqpassword, hash, function(err, isMatch){
		if(err) throw err;
		callback(null, isMatch);
	});
}
