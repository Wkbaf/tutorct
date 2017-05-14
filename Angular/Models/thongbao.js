var mongoose = require('mongoose');

var thongbaoSchema = new mongoose.Schema({
	giasu:{
		type: mongoose.Schema.Types.ObjectId,
		ref:'GiaSu',
		require: true
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
	noidung:{
		type: String,
		require: true
	},
	comment:[{
		user:{ //username of nguoi comment
			type: String
		}, 
		avatar:{ //avatar of nguoi comment
			type: String
		},
		content:{ //noi dung comment
			type: String
		},
		role:{ // gia su hay student comment
			type: String
		},
		created:{ //ngay comment
			type: Date,
			default: Date.now
		}
	}],
	create_at:{
		type: Date,
		default: Date.now
	}
});


var ThongBao = module.exports = mongoose.model('ThongBao', thongbaoSchema);

// update ThongBao by query
module.exports.updateByQuery = function(query, value, callback){
	ThongBao.update(query, {$set:value}, callback);
}

// update ThongBao by id
module.exports.updateById = function(id, value, callback){
	ThongBao.findByIdAndUpdate(id, {$set: value}, callback);
}
// get class by query
module.exports.getAnnByQuery = function(query, callback){
	ThongBao.find(query,null, {sort: {create_at:-1}}, callback);
}
// get ThongBao bang id
module.exports.getAnnById = function(id, callback){
    ThongBao.findById(id, callback);
}
