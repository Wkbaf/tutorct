var mongoose = require('mongoose');

var lopSchema = new mongoose.Schema({
	giasu:{
		type: mongoose.Schema.Types.ObjectId,
		ref:'GiaSu',
		require: true
	},
	deadline:{ // han chot dang ky
		type: Date,
		require: true
	},
	start:{ // ngay khai giang
		type: Date,
		require: true
	},
	monhoc:{ // noi dung thao luan
		type: String,
		require: true
	},
	hocphi:{
		// type: Number,
		type: String,
		require: true
	},
	noihoc:{
		type: String,
		require: true
	},
	tkb:[{ //thoi khoa bieu
		thu:{
			type: String,
			require: true
		},
		giobd:{
			type: String,
			require: true
		},
		phutbd:{
			type: String,
			require: true
		},
		giokt:{
			type: String,
			require: true
		},
		phutkt:{
			type: String,
			require: true
		}
	}],
	noidung:{ // noi dung hoc
		type: String,
		require: true
	},
    danhgia:[{
        hs_username: String,
        khanang: Number,
        tinhthan: Number,
        phuongphap: Number,
        tucach: Number
    }],
    hsno:{// so luong hoc sinh toi da
    	type: Number,
    	require: true
    },
	hocsinh:[{
		hs_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref:'Student'
		},
		hs_username:{
			type: String
		},
		register_date:{
			type: Date,
			default: Date.now
		}
	}],
	create_at:{
		type: Date,
		default: Date.now
	}
});


var Lop = module.exports = mongoose.model('Lop', lopSchema);
// get tutor info in this class
module.exports.getClassTutor = function(value, callback){
    Lop.findOne(value)
    .populate('giasu')
	.exec(callback);
}

// update lop by query
module.exports.updateByQuery = function(query, value, callback){
	Lop.update(query, {$set:value}, callback);
}

// update lop by id
module.exports.updateById = function(id, value, callback){
	Lop.findByIdAndUpdate(id, {$set: value}, callback);
}
// get class by query
module.exports.getClassByQuery = function(query, callback){
	Lop.find(query,null, {sort: {create_at:-1}}, callback);
}
//get all class student registered
module.exports.getAllClassByQuery = function(query, callback){
    Lop.find(query,null, {sort: {create_at:-1}})
    .populate('giasu')
    .exec(callback);
}
// get lop bang id
module.exports.getClassById = function(id, callback){
    Lop.findById(id, callback);
}
