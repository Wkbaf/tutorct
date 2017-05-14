var mongoose = require('mongoose');
var ThayTro = require('./ThayTro');
var LienLacSchema = new mongoose.Schema({
	giasu:{
		type: mongoose.Schema.Types.ObjectId,
		ref:'GiaSu',
		require: true
	},
	// hocsinh:{
	// 	type: String,
	// 	ref:'Student',
	// 	require: true
	// },
	hocsinh:{
		hocsinh_id:{
			type: mongoose.Schema.Types.ObjectId,
			ref:'Student',
			require: true
		},
		hocsinh_username:{type: String}
	},
	monhoc:{
		type: String,
		require: true
	},
	khanang:{
		type: String
	},
	hanche:{
		type: String
	},
	nguyenvong:{
		type: String
	},
	khac:{
		type: String
	},
	trangthai:{// xac dinh gia su va hs co dong y day-hoc ko
		type: Number,
		require: true
	}, // 0: gs chua tra loi, 1: dong y, 2: ko
	tuchoi:{ // tai sao gia su tu choi day
		type: String
	},
	created_at: {
		type: Date,
		default: Date.now
	}
});

var LienLac = module.exports = mongoose.model("LienLac", LienLacSchema) ;

// hien thi thong tin chi tiet cua hoc sinh trong lien lac
// relative studentId in student and lienlac
module.exports.getContactSt = function(value, callback){
    LienLac.findOne(value)
    .populate('hocsinh.hocsinh_id')
    .populate('giasu')
	.exec(callback);
}

// tim lien lac bang gia su id va trangthai
module.exports.getContactByTutor = function(query, callback){
    LienLac.find(query, null, {sort: {create_at:-1}},callback);
}

// module.exports.getContactByTutor = function(giasuId, trangthai, callback){
//     LienLac.find({giasu: giasuId, trangthai: trangthai}, null, {sort: {create_at:'asc'}},callback);
// }
// tim lien lac bang id
module.exports.getContactById = function(id, callback){
    LienLac.findById(id, callback);
}

// chap nhan day
module.exports.updateContact = function(id, value, callback){
	LienLac.findByIdAndUpdate(id, { $set: value }, callback);
}
