// luu yeu cau mon hoc
var mongoose = require('mongoose');

var feedbackSubjectSchema = new mongoose.Schema({
    studentname: String,
    content: String,
    subject: String,
    created_at: {type: Date, default: Date.now}

});
//P/s
//studentname == student username

var feedback = module.exports = mongoose.model("feedback", feedbackSubjectSchema);

//load feed back all
module.exports.loadFeedbackSubject = function(callback){
    feedback.find({}, {}, { sort: { 'created_at' : -1 }},callback);
}

//get feeadback by id feddback
module.exports.getFeedback = function(id, callback){
    feedback.findById(id, callback);
}

//get feedback by student username
module.exports.loadFeedbackByUsername = function(username, callback){
    feedback.find({studentname: username}, callback);
}

//get feedback by id feedback
module.exports.getFeedbackById = function(id, callback){
    feedback.findById(id, callback);
}