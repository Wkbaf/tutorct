var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var GiaSu = require('../Angular/Models/giasu');
var User = require('../Angular/Models/user');
var Lop = require('../Angular/Models/lophoc');

// load trang home
router.get('/',function(req,res,next){
	res.render('Starter',{title:"Super App"});
});
// find user by username
// value: Object in forEach
// result: array of user which finded
// object: obj that want to find user
// res: response
var findUser = function(value, result, object, res){
	User.getUserByUsername(value.username, function(err, user){
		if(err) throw err;
		Lop.findOne({giasu: value._id})
			.select({"danhgia":1,"_id":0})
			.exec(function(err, lop){
				result.push({giasu: value, user: user, rating: lop});
				if(result.length === object.length){
					res.json({success: true, giasu: result});
				}
			}); // lop find
		
	});// getUserByUsername
}
// load trang find a tutor -> list of tutor
router.get('/ftutor', function(req, res, next){
	GiaSu.listTutor(function(err, giasu){
		if(err){
			console.log(err);
			res.json({success: false, giasu: null});
		} else {
			var result = [];
			if(!giasu.length){
				res.json({success: false, message:"Không tìm thấy gia sư"});
			} else {
				giasu.forEach(function(value, index){
					findUser(value, result, giasu, res);
				});
			}
			
		}
	}, 0);
});

//  list all class with tutor info
// chi hien thi lop chua het han dang ky
router.get('/listallclass', function(req, res){
	var today = new Date();
	Lop.find({deadline:{$gte:today}}, null, {sort: {create_at:-1}})
	.populate('giasu') // only return the Persons name
	.exec(function (err, lop) {
		if(err){
			console.log(err);
			res.json({success: false, message: "Loi tim kiem"});
		} else {
			res.json({success: true, lop: lop});
		}

	})
});

router.get('/admin/',function(req,res,next){
    res.render('Admin',{title:"Admin"});
});

module.exports = router;