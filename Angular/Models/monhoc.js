var mongoose = require('mongoose');

var MonSchema = new mongoose.Schema({
    tenmon: {
        type: String,
        unique: true
    },
    loaimon: String,
    created_at: {type: Date, default: Date.now}

});

// var Subject = mongoose.model('MonHoc');

var MonHoc = module.exports = mongoose.model("MonHoc", MonSchema);

// liet ke all mon hoc
module.exports.listMonHoc = function(callback){
    MonHoc.find(callback);
}

exports.findById = function(id, callback){
    MonHoc.findById(id, function(err, user){
        if(err){
            return callback(err);
        }
        return callback(null, user);
    });
}

exports.save = function(id, callback){
    MonHoc.save(function (err) {
      if (err) return handleError(err);
      // saved!
    })
}

