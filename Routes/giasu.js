var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var MonHoc = require('../Angular/Models/monhoc');
var GiaSu = require('../Angular/Models/giasu');
var LienLac = require('../Angular/Models/lienlac');
var Student = require('../Angular/Models/student');
var User = require('../Angular/Models/user');
var Lop = require('../Angular/Models/lophoc');
var ThongBao = require('../Angular/Models/thongbao');
var contactStudent = require('../Angular/Models/contactStudent');
var ThayTro = require('../Angular/Models/ThayTro');
var ThaoLuan = require('../Angular/Models/ThaoLuan');
var ThemMon = require('../Angular/Models/themmon');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'tutor.ct.ctu@gmail.com',
        pass: 'luanvan2017'
    }
});
transporter.on('log', console.log);

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
/*
	hien thi all thong tin cua gia su
	giasu, user, danh gia trong lop
*/
var findTutorById = function(giasuId, other, res){
	GiaSu.findById(giasuId, function(err, giasu){
		if(err){
			console.log(err);
		} else {
			User.findOne({"username":giasu.username}, function(err, user){
				if(err) throw err;
				ThayTro.count({$or:[{"giasu.gs_id":"5912cb3229b7a7041c57baaf"}, {"giasu.gs_username":'cuong'}]}, function(err, count){
					if(err){
						console.log(err);
					}
					Lop.findOne({giasu: giasuId})
						.select({"danhgia":1,"_id":0})
						.exec(function(err, lop){
							if(err) throw err;
							res.json({success: true, giasu: giasu, user: user, rating: lop, other: other, hsno: count});
						}); // lop find
				});
				
			});//User.findOne
		}
	});
}
/*
	save into thaytro collection
	giasu {gs_id, gs_username, gs_hoten}
	hocsinh{hs_id, hs_username}
	monhoc
*/
var saveStudentTutor = function(giasuId, hsId, monhoc){
	GiaSu.getTutorById(giasuId, function(err, gs){
		if(err){
			console.log(err);
		} else {//getStudentByUsername
			Student.getStudentById(hsId, function(err, st){
				ThayTro.getThayTroByQuery({$or:[{"giasu.gs_id":giasuId},{"giasu.gs_username":gs.username}],"hocsinh.hs_id":hsId}, function(err, tt){
					if(err){
						console.log(err);
					} else {
						if(!tt){
							var thaytro = new ThayTro({
								giasu:{
									gs_id: giasuId,
				    				gs_username: gs.username,
				    				gs_hoten: gs.hoten
								},
								hocsinh:{
									hs_id: hsId, hs_username: st.username
								},
								monhoc: monhoc
							});
							// luu vao bang thaytro
							thaytro.save(function(err){
								if(err){
									console.log(err);
								}
								console.log('save thaytro success');
							});
						} else{
							ThayTro.pushMon(giasuId, hsId, monhoc, function(err, tt){
								if(err){
									console.log(err);
								}
							})
						}
					}//if thaytro err
				});// getThayTroByQuery
			}); // getStudentById
		} // if gia su err
	}); //getTutorById
}


// tim gia su theo mon hoc
router.post('/findtutorbysubj',function(req, res, next){
	var daymon = req.body.tenmon;
	console.log("daymon" + daymon);
	GiaSu.find({"daymon" : daymon}, function(err, giasu){
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
	});

});
// tim gia su bang giasu._id
router.get('/findtutorbyid/:giasuId', function(req, res, next){
	var giasuId = req.params.giasuId;
	findTutorById(giasuId, null, res);
	// console.log('giasuid '+giasuId);
	// GiaSu.getTutorById(giasuId, function(err, giasu){
	// 	if(err){
	// 		console.log('findtutorbyid '+err);
	// 		res.json({success: false, giasu: null});
	// 	} else {
	// 		res.json({success: true, giasu: giasu ? giasu:null});
	// 	}
	// })
});
// tim gia su bang username
router.get('/findtutorbyusername/:username', function(req, res, next){
	var username = req.params.username;
	GiaSu.getTutorByUsername(username, function(err, giasu){
		if(err){
			res.json({success: false, message: err});
		} else {
			res.json({success: true, giasu: giasu});
		}
	});
});
// tim gia su bang query (mon va noiday)
router.post('/findtutorbyquery', function(req, res, next){
	var daymon =  req.body.tenmon;
	var noiday = req.body.noiday;
	GiaSu.find({$or:[{'daymon': daymon}, {'noiday': noiday}]}, function(err, giasu){
		if(err){
			console.log(err);
			res.json({success: false, message: err});
		} else {
			// console.log(giasu);
			res.json({success: true, giasu: giasu});
		}
	});
});
// luu lienlac voi giasu
router.post('/contacttutor/:giasuId', function(req, res, next){
	var username = req.body.hocsinh_username;
	var giasuId = req.params.giasuId;
	var monhoc = req.body.monhoc;
	// kiem tra hoc sinh da hoc voi gia su nay chua
	Student.getStudentByUsername(username, function(err, student){
		if(err) throw err;
		var lienlac = new LienLac();
		lienlac.hocsinh = {
			hocsinh_username : username,
			hocsinh_id : student._id
		}
		lienlac.giasu = giasuId;
		lienlac.monhoc = monhoc;
		lienlac.khanang = req.body.khanang;
		lienlac.hanche = req.body.hanche;
		lienlac.nguyenvong = req.body.nguyenvong;
		lienlac.khac = req.body.khac;
		lienlac.trangthai = 0;

		var query = {
			"giasu.gs_id": lienlac.giasu,
			"hocsinh.hs_username": lienlac.hocsinh.hocsinh_username
		};
		ThayTro.find(query, function(err, tt) {
			if(err) throw err;
			if(!tt.length){
				console.log('save vo');
				lienlac.save(function(err){
					if(err){
						console.log(err);
						res.json({success: false, message: err});
					} else {
						res.json({success: true});
					}
				});//lienlac.save
			} else {
				res.json({success: false, message: 'Bạn đã trở thành học sinh của gia sư này rồi. Để liên lạc bạn có thể sử dụng tính năng chat của hệ thống.'});
			}
		});
	});//getStudentByUsername
});

// find contact by giasuId
router.post('/findcontactbytutor/:giasuId', function(req, res, next){
	var giasuId = req.params.giasuId;
	var trangthai = req.body.trangthai;
	var query = {
		giasu: giasuId,
		trangthai: trangthai
	};
	LienLac.find(query, null, {sort: {create_at:-1}}, function(err, contact){
		if(err){
			res.json({success: false, message: err});
		} else {
			res.json({success: true, contact: contact});
		}
	})
});

// find contact by tutor id and student id
router.post('/findcontactjoin', function(req, res){
	var value = {
		'hocsinh.hocsinh_id': req.body.hocsinh,
		'giasu' : req.body.giasu
	};
	LienLac.getContactSt(value, function(err, contact){
		if(err) throw err;
		res.json({contact: contact, hocsinh: contact.hocsinh});
	});
});

//find contact by id
router.get('/findcontactid/:contactId', function(req, res){
	LienLac.getContactById(req.params.contactId, function(err, lienlac){
		if(err){
			console.log(err);
			res.json({success: false, message: 'Ko tim thay'});
		} else {
			res.json({success: true, lienlac: lienlac});
		}
	});
});

// accept teach that student
router.post('/acceptteach', function(req, res){
	var id = req.body._id;
	console.log(id);
	var value = {trangthai: 1}; // 1 - dong y
	LienLac.updateContact(id, value, function(err, contact){
		if(err){
			console.log(err);
			res.json({success: false, message: err, contact: null});
		} else {
			// them hocsinh vao ds hocsinh hoc vs giasu
			// tim giasu theo id
			var giasuId = req.body.giasuId;
			var hsId = req.body.hocsinhId;
			var monhoc = contact.monhoc;
			saveStudentTutor(giasuId, hsId, monhoc);
			res.json({success: true, message: "Đã đồng ý dạy", contact: contact});
		}
	});
})

// reject teach that student
router.post('/rejectteach', function(req, res){
	var id = req.body._id;
	console.log(id);
	var reject = req.body.reject;
	var value = {
		trangthai: 2,
		tuchoi: reject
	}; // 2 - tu choi day
	console.log('value ', value);
	LienLac.updateContact(id, value, function(err, contact){
		if(err){
			console.log(err);
			res.json({success: false, message: err, contact: null});
		} else {
			res.json({success: true, message: "update success", contact: contact});
		}
	});
})

// update account
router.post('/updateacc', function(req, res){
	// tim user = id
	var _id = req.body._id;
	var currentPwd = req.body.currentPwd;

	User.getUserById(_id, function(err, user){
		if(err){
			console.log(err);
			res.json({success: false, message: "User không tồn tại"});
		} else {
			// so sanh currentPassword & password
			User.comparePassword(currentPwd, user.password, function(err, isMatch){
				if (err) throw err;
	            if (isMatch) {
	            	var newPwd = req.body.newPwd;
	            	bcrypt.hash(newPwd, 10, function(err, hash){
	            		if(err) throw err;
						var email = req.body.email;
	            		var value = {email: email, password: hash};
	            		User.updateUser(_id, value, function(err, user){
	            			if(err){
	            				console.log(err);
	            				res.json({success: false, message: err});
	            			} else {
	            				console.log('change password success');
	            				res.json({success: true, message: 'Thay đổi mật khẩu thành công'});
	            			}
	            		});
	            	});
	            } else {
	            	console.log('current password ko dung');
	                res.json({success: false, message: 'Current password không đúng'});
	            }
			});
		}
	})
});

// update profile
router.post('/updateprofile', function(req, res){
	var id = req.body._id;
	var value = {
		hoten: req.body.hoten,
		ngaysinh: req.body.ngaysinh,
		diachi: req.body.diachi,
		sdt: req.body.sdt
	};
	GiaSu.updateTutor(id, value, function(err, giasu){
		if(err){
			console.log(err);
			res.json({success: false, message: "Không thể cập nhật"});
		} else {
			res.json({success: true, message: "Cập nhật thành công"});
		}
	});
});

// update job
router.post('/updatejob', function(req, res){
	var id = req.body._id;
	var value = {
		noicongtac: req.body.noicongtac,
		daymon: req.body.daymon,
		noiday: req.body.noiday,
		kinhnghiem: req.body.kinhnghiem
	};
	console.log(value);
	GiaSu.updateTutor(id, value, function(err, giasu){
		if(err){
			console.log(err);
			res.json({success: false, message: "Không thể cập nhật"});
		} else {
			res.json({success: true, message: "Cập nhật thành công"});
		}
	});
});

//them lop hoc moi
router.post('/addclass', function(req, res){
	// console.log(req.body);
	var query = {
		giasu: req.body.tutor._id,
		start: req.body.tutor.start,
		monhoc : req.body.tutor.monhoc,
		noihoc : req.body.tutor.noihoc
	};
	// if 1 giasu mo 2 lop #mon#ngaykhaigiang#noihoc -> ko duoc
	Lop.find(query, function(err, lophoc){
		if(err) throw err;
		// da co lop tuong tu
		if(lophoc.length > 0){
			res.json({success: false, message: "Lớp này đã được mở. Vui lòng vào trang danh sách lớp để xem lại"});
		} else {
			var lop = new Lop();
			lop.giasu =  req.body.tutor._id;
			lop.deadline = req.body.tutor.deadline;
			lop.start = req.body.tutor.start;
			lop.monhoc = req.body.tutor.monhoc;
			lop.hocphi = req.body.tutor.hocphi;
			lop.noihoc = req.body.tutor.noihoc;
			lop.noidung = req.body.tutor.noidung;
			lop.hsno = req.body.tutor.hsno;
			var tkb = req.body.tkb;
			tkb.forEach(function(current, index){
				var arr = {
					thu: current.thu,
					giobd: current.giobd,
					phutbd: current.phutbd,
					giokt: current.giokt,
					phutkt: current.phutkt
				};
				lop.tkb.push(arr);
			});
			// lop.tkb = tkb;
			console.log(tkb);
			// save lop
			lop.save(function(err, lop){
				if(err){
					console.log(errr);
					res.json({success: false, message: 'Không thể tạo lớp mới'});
				} else {
					res.json({success: true, lop: lop});
				}
			});
		} // else
	});// find
});

// list class by giasuId
router.get('/classlist/:giasuId', function(req, res){
	var query = {giasu: req.params.giasuId};
	Lop.getClassByQuery(query, function(err, lop){
		if(err){
			console.log(err);
			res.json({success: false, message: "Gia sư id ko hợp lệ"});
		} else {
			console.log(lop);
			res.json({success: true, lop: lop});
		}
	})
});
// get class info by classId
router.get('/classdetail/:classId', function(req, res){
	Lop.getClassById(req.params.classId, function(err, lop){
		if(err){
			console.log(err);
			res.json({success: false, message: 'Không tìm thấy lớp'});
		} else {
			findTutorById(lop.giasu, lop, res);
			// res.json({success: true, lop: lop});
		}
	})
})
// update class
router.post('/classupdate/:classId', function(req, res){
	var classId = req.params.classId;
	var arrTkb = [];
	var tkb = req.body.tkb;
	tkb.forEach(function(current, index){
		var arr = {
			thu: current.thu,
			giobd: current.giobd,
			phutbd: current.phutbd,
			giokt: current.giokt,
			phutkt: current.phutkt
		};
		arrTkb.push(arr);
	});
	var value = {
		start : req.body.start,
		deadline : req.body.deadline,
		monhoc : req.body.monhoc,
		hocphi : req.body.hocphi,
		noihoc : req.body.noihoc,
		noidung : req.body.noidung,
		hsno: req.body.hsno,
		tkb: arrTkb
	};
	Lop.updateById(classId, value, function(err, lop){
		if(err){
			console.log(err);
			res.json({success: false, message: 'Không thể cập nhật'});
		} else {
			res.json({success: true, message: "Cập nhật thành công"});
		}
	})
});
// delete class
router.get('/deleteclass/:classId', function(req, res){
	var classId = req.params.classId;
	Lop.remove({_id: classId}, function(err){
		if(err){
			console.log(err);
			res.json({success: false, message: 'Không thể xóa'});
		} else {
			res.json({success: true, message: 'Đã xóa thành công'});
		}
	})
});
// xoa hoc sinh da dang ky trong lophoc
router.get('/unregisterclass/:classId/:studentId', function(req, res){
	var classId = req.params.classId;
	var studentId = req.params.studentId;
	Lop.update({_id: classId}, {$pull:{hocsinh:{hs_id:studentId}}}, function(err){
		if(err){
			console.log(err);
			res.json({success: false, message: 'Không thể xóa'});
		} else {
			res.json({success: true, message: 'Đã xóa thành công'});
		}
	})
});
// bao cao vi pham if hocsinh co vi pham >3 --> ko login cho class -> ds hoc sinh
router.get('/baocaovipham/:classId/:giasuId/:studentId', function(req, res){
    var classId = req.params.classId;
    var giasuId = req.params.giasuId;    
    var studentId = req.params.studentId;
    // xoa hoc sinh trong lop
    Lop.update({_id: classId}, {$pull:{hocsinh:{hs_id:studentId}}}, function(err){
		if(err){
			console.log(err);
		}
	});
	// xoa quan he trong thay tro
	ThayTro.remove({"giasu.gs_id":giasuId, "hocsinh.hs_id":studentId}, function(err){
		if(err){
			console.log(err);
		}
	});
    Student.getStudentById(studentId, function(err, student){
        User.getUserByUsername(student.username, function(err, ur){
            if(err) throw err;
            User.update({username: student.username}, {$inc: { vipham: 1}}, function(err, user){
            	console.log('update user vipham');
                if(err){
                    res.json({success: false, message: 'Không thể báo cáo vi phạm'});
                } else if(ur.vipham === 2){
                     // gui email xac nhan dang ky
                        var mailOptions = {
                            from: 'Mang Gia Su <tutor.ct.ctu@gmail.com>',
                            to: ur.email,
                            subject: 'Thông Báo Khóa Tài Khoản Tại Tutor.ct',
                            text: 'Thân chào '+ur.username+
                                    'Tài khoản của bạn đã bị khóa vì hệ thống nhận được các báo cáo vi phạm từ các người dùng khác',
                            html: 'Thân chào <strong>'+ur.username+ '</strong>,<br><br>'+
                                    'Tài khoản của bạn đã bị khóa vì hệ thống nhận được các báo cáo vi phạm từ các người dùng khác'
                        };
                        transporter.sendMail(mailOptions, function(err, info){
                            if(err){
                                console.log(err);
                            } else{
                                console.log('Email sent');
                                res.json({success: true});
                            }
                        });
                }
                res.json({success: true});
            }) //user update
        });        
    });// getStudentById
});
// bao cao hs vi pham cho studentList
// xoa trong thaytro va all lop cua gia su nay
router.get('/studentvipham/:gs_username/:studentId', function(req, res){
	var gs_username = req.params.gs_username;
	var studentId = req.params.studentId;
	console.log(studentId);
	GiaSu.getTutorByUsername(gs_username, function(err, giasu){
		var gs_id = giasu._id;		
		// xoa hs trong all lop cua gia su nay
		Lop.update({"giasu":gs_id, "hocsinh.hs_id":studentId}, {$pull:{hocsinh:{hs_id:studentId}}}, function(err, doc){
				if(err){
					console.log(err);
				}
				console.log(doc);
			}); // lop update
		Student.getStudentById(studentId, function(err, student){
			// xoa quan he trong thay tro
			ThayTro.remove({$or:[{"giasu":gs_id},{"giasu.gs_username":gs_username}], $or:[{"hocsinh.hs_id":studentId},{"hocsinh.hs_username":student.username}] }, function(err){
				if(err){
					console.log(err);
				}
			}); // thaytro remove	
			
        	User.getUserByUsername(student.username, function(err, ur){
	            if(err) throw err;
	            User.update({username: student.username}, {$inc: { vipham: 1}}, function(err, user){
	            	console.log('update user vipham');
	                if(err){
	                    res.json({success: false, message: 'Không thể báo cáo vi phạm'});
	                } else if(ur.vipham === 2){
	                     // gui email xac nhan dang ky
	                        var mailOptions = {
	                            from: 'Mang Gia Su <tutor.ct.ctu@gmail.com>',
	                            to: ur.email,
	                            subject: 'Thông Báo Khóa Tài Khoản Tại Tutor.ct',
	                            text: 'Thân chào '+ur.username+
	                                    'Tài khoản của bạn đã bị khóa vì hệ thống nhận được các báo cáo vi phạm từ các người dùng khác',
	                            html: 'Thân chào <strong>'+ur.username+ '</strong>,<br><br>'+
	                                    'Tài khoản của bạn đã bị khóa vì hệ thống nhận được các báo cáo vi phạm từ các người dùng khác'
	                        };
	                        transporter.sendMail(mailOptions, function(err, info){
	                            if(err){
	                                console.log(err);
	                            } else{
	                                console.log('Email sent');
	                                res.json({success: true});
	                            }
	                        });
	                }
	                res.json({success: true});
	            }) //user update
	        });        
    	});// getStudentById
	});//getTutorByUsername
});
// student signup class
router.get('/singupclass/:classId/:username', function(req, res){
	var classId = req.params.classId;
	var username = req.params.username;
	Lop.getClassById(classId, function(err, lop){
		if(err){
			console.log(err);
			res.json({success: false, message: 'không tìm thấy lớp'});
 		} else {
 			var today = new Date();
 			if(lop.deadline  < today){
 				res.json({success: false, message: 'Đã hết hạn đăng ký'});
 			} else if(lop.hocsinh.length === lop.hsno){
 				res.json({success: false, message: 'Đã hết chỗ'});
 			} else {
 				var giasuId = lop.giasu;
	 			var monhoc = lop.monhoc;
	 			Student.getStudentByUsername(username, function(err, student){
	 				if(err){
	 					console.log('############## signup lop ################\n'+err);
	 					res.json({success: false, message: 'User không tồn tại'});
	 				} else {
	 					var hocsinh = {hs_id: student._id, hs_username: username};
	 					// kiem tra hoc sinh do dang ky lop nay chua
						Lop.update({ _id: classId, 'hocsinh.hs_id': { $ne: student._id } }, { $push: { hocsinh: hocsinh } },
		                function(err, lop) {
		                    if (err) {
		                        console.log('######################### lop signup ' + err);
		                        res.json({ success: false, message: 'Bạn đã đăng ký lớp này rồi' });
		                    } else {
		                    	if(lop.n === 0){// n: 0, modified: 0, ok:1
		                    		res.json({ success: false, message: 'Bạn đã đăng ký lớp này rồi' });
		                    	} else {
		                    		// luu thong tin vao thaytro
		                    		saveStudentTutor(giasuId, student._id, monhoc);
		                    		res.json({ success: true, message: 'Bạn đã đăng ký lớp này thành công' });
		                    	}
		                    }
		            	}); // lop update
	 				} // else Student.getStudentByUsername
	 			})//getStudentByUsername
 			}
 		}
	});//getClassById
});
// tao thong bao moi
router.post('/createannounce/:classId', function(req, res){
	var thongbao = new ThongBao({
		giasu: req.body._id,
		lop: req.params.classId,
		topic: req.body.topic,
		noidung: req.body.noidung
	});
	thongbao.save(function(err, thongbao){
		if(err){
			console.log(err);
			res.json({success: false, message: 'Không thể tạo thông báo mới'});
		} else {
			res.json({success: true, message: 'Đã tạo thông báo thành công'});
		}
	});
});
// list announce
router.get('/listannounce/:classId', function(req, res){
	ThongBao.find({}, null, {sort: {create_at:-1}}, function(err, thongbao){
		if(err){
			console.log(err);
			res.json({success: false, message: 'Chưa có thông báo'});
		} else {
			res.json({success: true, thongbao: thongbao});
		}
	});
});
// get announce detail
router.get('/announcedetail/:announceId', function(req, res){
	ThongBao.getAnnById(req.params.announceId, function(err, thongbao){
		if(err){
			console.log(err);
			res.json({success: false, message: "Không tìm thấy thông báo"});
		} else {
			res.json({success: true, thongbao: thongbao});
		}
	})
	// ThongBao.findById(req.params.announceId,null, {sort:{"comment.created":-1}} function(err, thongbao){
	// 		if(err){
	// 		console.log(err);
	// 		res.json({success: false, message: "Không tìm thấy thông báo"});
	// 	} else {
	// 		res.json({success: true, thongbao: thongbao});
	// 	}
	// })
});
// update announce
router.post('/announceupdate/:announceId', function(req, res){
	var announceId = req.params.announceId;
	var query = {
		topic: req.body.topic,
		noidung: req.body.noidung
	};
	ThongBao.updateById(announceId, query, function(err, thongbao){
		if(err){
			console.log(err);
			res.json({success: false, message: 'Cập nhật không thành công'});
		} else {
			res.json({success: true, message: 'Cập nhật thành công'});
		}
	});
});
// xoa thong bao
router.get('/deleteannounce/:announceId', function(req, res){
	var announceId = req.params.announceId;
	ThongBao.remove({_id: announceId}, function(err){
		if(err){
			console.log(err);
			res.json({success: false, message: 'Không thể xóa'});
		} else {
			res.json({success: true, message: 'Đã xóa thành công'});
		}
	})
});
// get contactstudent list by tutor username
router.get('/getstudentresp/:tutorname', function(req, res){
	var username = req.params.tutorname;
	console.log('#####################################', req.body);
	contactStudent.find({tutorUsername: username}, function(err, ctStudent){
		if(err){
			console.log(err);
			res.json({success: false, message: 'Không tìm thấy liên lạc'});
		} else {
			res.json({success: true, ctStudent: ctStudent});
		}
	});
});
// get contactstudent detail
router.get('/ctstudentdetail/:contactId', function(req, res){
	var contactId = req.params.contactId;
	contactStudent.getMailStudentById(contactId, function(err, contact){
		if(err){
			console.log(err);
			res.json({success: false, message: 'Không tìm thấy'});
		} else {
			res.json({success: true, contact: contact});
		}
	});
});
// liet ke danh sach hoc sinh theo gia su username
// tutor dasshbroad/student List
router.get('/liststudent/:username', function(req, res){
	ThayTro.find({"giasu.gs_username":req.params.username})
	.populate('hocsinh.hs_id')
	.exec(function(err, gs){
		if(err){
			res.json({success: false, message: 'Không tìm thấy'});
		} else {
			console.log(gs);
			res.json({success: true, list: gs});
		}
	});
});
// gia su comment thong bao
router.post('/addcomment/:announceId', function(req, res){
	var announceId = req.params.announceId;
	var avatar = req.body.avatar;
	var value = {
		user: req.body.user,
		content: req.body.content,
		avatar: avatar
	};
	ThongBao.update({_id: announceId}, {$push:{comment: value}}, function(err, comment){
		if(err){
			console.log(err);
			res.json({success: false, message: 'Không thể cập nhật'});
		} else {
			res.json({success: true, message: 'Đã thêm bình luận'});
		}
	});
});
// add thao luan for class
router.post('/addthaoluan/:classId/:author', function(req, res) {
	var author_name = req.params.author;
	User.getUserByUsername(author_name, function(err, user){
		if(err){
			console.log(err);
		} else {
			if(!user){
				res.json({success: false, message: 'user không tồn tại'});
			} else {
				var author = {
					author_id: user._id,
					author_name : author_name,
					avatar: user.avatar
				};
				// save thao luan
				var thaoluan = new ThaoLuan({
					author: author,
					lop: req.params.classId,
					topic: req.body.topic,
					content: req.body.content
				});
				thaoluan.save(function(err){
					if(err){
						console.log(err);
						res.json({success: false, message: 'Không thể lưu'});
					}
					console.log('save thaoluan success');
					res.json({success: true});
				});
			}
		}
	});
});
// list thaoluan
router.get('/listthaoluan/:classId', function(req, res){
	ThaoLuan.find({lop:req.params.classId}, null, {sort: {create_at:-1}}, function(err, thaoluan){
		if(err){
			console.log(err);
			res.json({success: false, message: 'Chưa có thông báo'});
		} else {
			res.json({success: true, thaoluan: thaoluan});
		}
	});
});
// xem thong tin chi tiet cua thao luan
router.get('/thaoluandetail/:thaoluanId', function(req, res){
	ThaoLuan.findById(req.params.thaoluanId, function(err, thaoluan){
		if(err){
			console.log(err);
			res.json({success: false, message: 'Không tìm thấy thaoluan'});
		} else {
			res.json({success: true, thaoluan: thaoluan});
			// ThaoLuan.findByIdAndUpdate(req.params.thaoluanId, {$inc: { view: 1} }, function(err, thaoluan){
			// 	if(err) throw err;
			// });
		}
	});
});
// update thaoluan
router.post('/thaoluanupdate/:thaoluanId', function(req, res){
	var thaoluanId = req.params.thaoluanId;
	var query = {
		topic: req.body.topic,
		content: req.body.content
	};
	ThaoLuan.updateById(thaoluanId, query, function(err, thaoluan){
		if(err){
			console.log(err);
			res.json({success: false, message: 'Cập nhật không thành công'});
		} else {
			res.json({success: true, message: 'Cập nhật thành công'});
		}
	});
});
// xoa thao luan
router.get('/deletethaoluan/:thaoluanId', function(req, res){
	var thaoluanId = req.params.thaoluanId;
	ThaoLuan.findById(thaoluanId, function(err, thaoluan){
		if(err){
			console.log(err);
			res.json({success: false, message: 'Không thể xóa'});
		} else {
			var resLen = thaoluan.response.length;
			// neu co nguoi tra loi thi ko cho xoa
			if(resLen == 0){
				ThaoLuan.remove({_id: thaoluanId}, function(err){
					if(err){
						console.log(err);
						res.json({success: false, message: 'Đã có người trả lời. Không thể xóa'});
					} else {
						res.json({success: true, message: 'Đã xóa thành công'});
					}
				})
			} else {
				res.json({success: false, message: 'Đã có người trả lời. Không thể xóa'});
			}
		}
	});
});
// gia su comment thao luan
router.post('/addresponse/:thaoluanId', function(req, res){
	var thaoluanId = req.params.thaoluanId;
	var avatar = req.body.avatar;
	var value = {
		respondent: req.body.respondent,
		answer: req.body.answer,
		avatar: avatar
	};
	ThaoLuan.update({_id: thaoluanId}, {$push:{response: value}}, function(err, response){
		if(err){
			console.log(err);
			res.json({success: false, message: 'Không thể cập nhật'});
		} else {
			res.json({success: true, message: 'Đã thêm bình luận'});
		}
	});
});
// dem so lop cua


router.get('/find', function(req, res){
	// var giasu = GiaSu.findById("58eedc30cf5a011ce436d05a", tutorNe);
	ThayTro.count({$or:[{"giasu.gs_id":"5912cb3229b7a7041c57baaf"}, {"giasu.gs_username":'cuong'}]}, function(err, doc){
		if(err){
			console.log(err);
		}
		console.log(doc);
		res.json(doc);
	})
	// console.log(giasu);
	// 	res.send('re');
	// Lop.aggregate([
	// 	{ "$match": { "_id": '58eede75cf5a011ce436d05c' } },
	// 	{ "$unwind": "$danhgia" },
	// 	{
	// 		"$group": {
	// 			"_id":"$giasu",
	// 			"tucach": {$avg: "$danhgia.tucach"},
	// 			"khanang": {$avg:"$danhgia.khanang"},
	// 			"tinhthan": {$avg: "$danhgia.tinhthan"},
	// 			"phuongphap": {$avg: "$danhgia.phuongphap"}
	// 		}
	// 	}
	// ], function(err, results){
	// 	if (err) {
 //            console.error(err);
 //        } else {
 //            console.log(results);
 //            res.send(results);
 //        }
	// })
	// Lop.count({'giasu':"58eede75cf5a011ce436d05c"}, function(err, results){
	// 		if (err) {
 //            console.error(err);
 //        } else {
 //            console.log(results);
 //            res.send('results');
 //        }
	// })
})
function tutorNe(err, giasu){
	if(err){
		console.log(err);
	} else {
		return giasu.Schema.obj;
	}
}
module.exports = router;
// Mark.aggregate([
//         { $group: {
//             _id: '$Student_id',
//             markAvg: { $avg: '$Mark'}
//         }}
//     ], function (err, results) {
//         if (err) {
//             console.error(err);
//         } else {
//             console.log(results);
//         }
//     }
// );

//thêm môn học yêu cầu
router.post('/monhocYC/:tutorId', function(req, res){
    var idTutor = req.params.tutorId;

    var newThemMon = new ThemMon();
    newThemMon.tenmon = req.body.tenmon;
    newThemMon.loaimon = req.body.loaimon;
    newThemMon.giasu = idTutor;

    newThemMon.save(function(err, mon){
        if(err){
            console.log(errr);
            res.json({success: false, message: 'Không thể thêm môn học'});
        } else {
            res.json({success: true, mon: mon, message: "Gửi yêu cầu thêm môn thành công môn: "+ newThemMon.tenmon});
        }
    });
});