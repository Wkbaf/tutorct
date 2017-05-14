var mongoose = require('mongoose');

var thaoluanSchema = new mongoose.Schema({
	author:{ // nguoi tao thao luan
		author_id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		author_name: {
			type: String,
			require: true
		},
		avatar: {
			type: String
		}
	},
	lop:{
		type: mongoose.Schema.Types.ObjectId,
		ref:'Lop',
		require: true
	},
	topic:{
		type: String,
		require: true
	},
	content:{ // noi dung thao luan
		type: String,
		require: true
	},
	create_at:{
		type: Date,
		default: Date.now
	},
	response:[{
		respondent: { // nguoi tra loi
			type: String,
			require: true
		},
		avatar:{
			type: String,
			require: true
		},
		answer_date: {
			type: Date,
			default: Date.now
		},
		answer:{// noi dung tra loi
			type: String,
			require: true
		}
	}],
	view:{ // luot view
		type: Number,
		default: 0
	}
});


var ThaoLuan = module.exports = mongoose.model('ThaoLuan', thaoluanSchema);

// update thao luan by query
module.exports.updateByQuery = function(query, value, callback){
	ThaoLuan.update(query, {$set:value}, callback);
}

// update thao luan by id
module.exports.updateById = function(id, value, callback){
	ThaoLuan.findByIdAndUpdate(id, {$set: value}, callback);
}
// get thaoluan by query
module.exports.getThaoLuanByQuery = function(query, callback) {
	ThaoLuan.find(query, callback);
}
