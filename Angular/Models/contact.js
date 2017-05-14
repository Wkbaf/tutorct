var mongoose = require('mongoose');

var ContactSchema = new mongoose.Schema({
    subject: String,
    email: String,
    message: String,
    created_at: {type: Date, default: Date.now}

});

var contact = module.exports = mongoose.model("contact", ContactSchema);

//load all contact
module.exports.loadContact = function(callback){
    contact.find(callback);
}

//get a contact for view
module.exports.getContact = function(id, callback){
    contact.findById(id, callback);
}