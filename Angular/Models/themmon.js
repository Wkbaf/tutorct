// luu yeu cau mon hoc
var mongoose = require('mongoose');

var themmonSchema = new mongoose.Schema({
    tenmon: String,
    loaimon: String,
    trangthai: {
        type: Number,
        default: 0
    },
    giasu:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'GiaSu',
        require: true
    },
    created_at: {type: Date, default: Date.now}

});
//P/s
//studentname == student username

var themmon = module.exports = mongoose.model("themmon", themmonSchema);

//lấy danh sách thêm môn
module.exports.loadByQuery = function(query, callback){
    themmon.find(query, null, {sort: {created_at: -1}})
    .populate('giasu')
    .exec(callback);
}
