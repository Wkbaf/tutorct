var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var GiaSuSchema = new mongoose.Schema({
    thayco:{
        type: String,
        require: true
    },
    hoten:{
        type: String,
        require: true
    },
    username:{
        type: String,
        require: true,
        unique: true
    },
    ngaysinh:{
        type: Date
    },
    diachi:{
        type: String
    },
    sdt:{
        type:String
    },
    // email:{
    //     type:String,
    //     require: true,
    //     unique: true
    // },
    noicongtac:{type:String},
    kinhnghiem:{
        type:String,
    },
    noiday:[String], // day tai nha gia su hay tai nha hoc sinh
    daymon:[
        // mon_id:{
        //     type:mongoose.Schema.Types.ObjectId,
        //     // ref: 'MonHoc',
        //     require: true
        // },
           String
    ],
    danhgia:[{
        user_rating: {
            type: String,
            require: true,
            unique: true
        },
        rating:{ // diem rating
            type: Number,
            require: true
        }
    }]
});

var GiaSu = module.exports = mongoose.model("GiaSu", GiaSuSchema) ;

// update gia su
module.exports.updateTutor = function(id, value, callback){
    GiaSu.findByIdAndUpdate(id, {$set: value}, callback);
}
// liet ke danh sach gia su, hien thi toi da limit
module.exports.listTutor = function(callback, limit){
    GiaSu.find(callback).limit(limit);
}
// tim gia su bang id
module.exports.getTutorById = function(id, callback){
    GiaSu.findById(id, callback);
}
// tim gia su bang username
module.exports.getTutorByUsername = function(username, callback){
    GiaSu.findOne({username: username}, callback);
}
// tim gia su bang query
module.exports.getTutorByQuery = function(query, callback){
    GiaSu.find(query, callback);
}
// find tutor by query
module.exports.getOneTutorByQuery = function(query, callback){
    GiaSu.findOne(query, callback);
}





