var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var adminSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        require: true,
        lowercase: true
    },
    password:{
        type: String,
        require: true
    },
    phone:{
        type: String,
        lowercase: true
    },
    name:{
        type: String,
        lowercase: true
    },
    role:{
        type: String,
        require:true
    },
    date:{
        type: Date,
        lowercase: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// adminSchema.pre('save',function(next){
//     var admin = this;
//     bcrypt.hash(admin.password,null,null,function(err,hash){
//         if (err) {return next(err);}
//         admin.password = hash;
//         next();
//     });
// });

adminSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password,this.password);
}

var Admin = module.exports = mongoose.model('Admin', adminSchema);

module.exports.getAdminByEmail = function(email, callback){
    Admin.findOne({email: email}, callback);
}

module.exports.getAdminById = function(id, callback){
    Admin.findById(id, function(err, user){
        if(err){
            return callback(err);
        }
        return callback(null, user);
    });
}


module.exports.comparePassword = function(reqpassword, hash, callback){
    bcrypt.compare(reqpassword, hash, function(err, isMatch){
        if(err) throw err;
        callback(null, isMatch);
    });
}

module.exports.getAdminById = function(id, callback){
    Admin.findById(id, callback);
}

