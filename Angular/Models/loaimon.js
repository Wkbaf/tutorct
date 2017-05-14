var mongoose = require('mongoose');

var LoaiMonSchema = new mongoose.Schema({
    loaimon: {
        type: String,
        unique: true
    },
    created_at: {type: Date, default: Date.now}

});

var LoaiMon = module.exports = mongoose.model("LoaiMon", LoaiMonSchema);

// liet ke all mon hoc
module.exports.listLoaiMon = function(callback){
    LoaiMon.find(callback);
}

exports.findById = function(id, callback){
    LoaiMon.findById(id, function(err, user){
        if(err){
            return callback(err);
        }
        return callback(null, user);
    });
}

exports.save = function(id, callback){
    LoaiMon.save(function (err) {
      if (err) return handleError(err);
      // saved!
    })
}

