var mongoose = require('mongoose');

var StudentSchema = new mongoose.Schema({
    fullname: String,
    ngaysinh:{
      type: Date,
    },
    gender:String,
    quote: String,
    descr: String,
    phone: String,
    mail: {
      type: String,
      unique: true
    },
    noihoc: String,
    mon:[String],
    diachi: String,
    username: {
      type: String,
      unique: true
    },
    created_at: {type: Date, default: Date.now}

});

// mongoose.model('Student', StudentSchema);
var Student = module.exports = mongoose.model('Student', StudentSchema);

// find student by username
module.exports.getStudentByUsername = function(username, callback){
    Student.findOne({username: username}, callback);
}

//find student by id
module.exports.getStudentById = function(id, callback){
    Student.findById(id, callback);
}

//find a student by subject
module.exports.getStudentBySubject = function(subject, callback){
    Student.findOne({mon: subject}, callback);
}

//find student by subject
module.exports.getAllStudentBySubject = function(subject, callback){
    Student.find({mon: subject}, callback);
    // Student.find({ $query: { mon: subject }, $orderby: { dateAdded: -1 } } );
}

//get id of student by username
module.exports.getIdStudentByUsername = function(username, callback){
    Student.find({username: username},callback)
    .select('_id')
    .exec(function(err, id) {
        console.log(id);
    });
    // Student.find({username: username}, '_id', callback);
}
