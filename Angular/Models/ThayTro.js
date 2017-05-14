var mongoose = require('mongoose');

var ThayTro = new mongoose.Schema({
    giasu:{
        gs_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'GiaSu'
        },
        gs_username:{
            type: String,
            require: true
        },
        gs_hoten: {
            type:String,
            require: true
        }
    },
    hocsinh:{
        hs_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'Student'
        },
        hs_username:{
            type: String,
            require: true
        }
    },
    monhoc:[{
            type: String
    }],
    status:{
        type: Number,
        default: 0
    }
});
var ThayTro = module.exports = mongoose.model('ThayTro', ThayTro);
// get thaytro by query
module.exports.getThayTroByQuery = function(query, callback){
    ThayTro.find(query, callback);
}

//find one
module.exports.getOneThayTroByQuery = function(query, callback){
    ThayTro.findOne(query, callback);
}

//update by giasuid and studentid
module.exports.pushMon = function(giasuid, hsid, monhoc, callback){
    ThayTro.update({"giasu.gs_id":giasuid, "hocsinh.hs_id":hsid, 'monhoc':{$ne:monhoc}},
       {$push:{monhoc:monhoc}} , callback);
}