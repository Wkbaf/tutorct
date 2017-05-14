// gia su lien lac voi hoc sinh
var mongoose = require('mongoose');

var ContactStudentSchema = new mongoose.Schema({
    studentUserName: {
        type: String,
    },
    tutorname: String,
    tutorUsername: String,
    subject: String,
    message: String,
    contentDeny: String,
    accept: Number, //=1 dong y =2 deny =0 default
    delete: {
        type: Number,
        default: 0
    }, //trạng thái ẩn khi xóa mail ==1 ẩn mail
    created_at: {type: Date, default: Date.now}

});

//username == tutor username

var contactStudent = module.exports = mongoose.model("contactStudent", ContactStudentSchema);

//load mail box of student by id student
module.exports.loadMailStudentByStudentId = function(studentId, callback){
    contactStudent.find({studentId: studentId}, callback);
}

//get view mail of student by _id mail
module.exports.getMailStudentById = function(id, callback){
    contactStudent.findById(id, callback);
}

///get mail by mail accept =1 and studentUsername (load tutor accepted)
module.exports.getMailStudentByAccept = function(studentUserName,callback){
    contactStudent.find({studentUserName: studentUserName, accept: 1},callback);

}

//load mail box of student with student username, accept=0 (not yet accept and deny) (for load mailbox)
module.exports.loadMailStudentByStudentUN = function(username, callback){
    contactStudent.find({studentUserName: username, accept: {$in: [0, 1, 2 ]}, delete: {$nin: [1]} }, callback).sort( { created_at: -1 } );
}

//get mail with username and student username and accept =1
module.exports.loadMailStudentByStUN = function(tutorUsername, studentUserName, callback){
    contactStudent.findOne({tutorUsername: tutorUsername, studentUserName: studentUserName, accept: 1}, callback);
}