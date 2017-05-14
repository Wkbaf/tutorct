var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');

// var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;

var User = require('../Angular/Models/user');
var Subject = require('../Angular/Models/monhoc');
var Admin = require('../Angular/Models/admin');
var Contact = require('../Angular/Models/contact');
var Feedback = require('../Angular/Models/feedback');
var monhocYC = require('../Angular/Models/themmon');
var LoaiMon = require('../Angular/Models/loaimon');
var mongoose = require('mongoose');
var Student = mongoose.model('Student');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'tutor.ct.ctu@gmail.com',
        pass: 'luanvan2017'
    }
});
transporter.on('log', console.log);

//save subject request
    router.post('/save', function(req,res){

        var newSubject = new Subject();

            // set the subject's
            newSubject.tenmon = req.body.name;
            newSubject.loaimon = req.body.category;

           // save the subject
            newSubject.save(function(err) {
                if (err){
                    console.log('Error in Saving subject: '+err);
                    throw err;
                }
                 res.json({success: true, message: "Thêm thành công môn: "+newSubject.tenmon+" có loại: "+newSubject.loaimon});
            });
    });

    //load subject request
    router.post('/list', function(req,res)
    {

          Subject.find(function(err, allSubject)
        {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
               console.log("can't load subject"+err);

            res.json(allSubject); // return all subject in JSON format
        });

    });

    //remove subject request
    router.post('/removeSubject/:subject', function(req,res)
    {
          var id = req.params.subject;

          Subject.findOneAndRemove({ _id: id }, function(err)
            {
              if (err)  res.json({success:false,message:err});

                        res.json({success:true, message: "Xóa môn học thành công"});
            });
    });

    //edit subject request (hiển thị giá trị cửa môn học)
    router.post('/editSubject/:subjectId', function(req,res)
    {
          var id = req.params.subjectId;

          //lấy thông tin môn học
          Subject.findById(id, function(err, subject)
            {
              if (err) res.json({success:false,message:err});

                       res.json(subject);
            });
    });
    //update subject request (cập nhật giá trị của môn học)
    router.post('/changeSubject/:subjectId', function(req,res)
    {
          var id = req.params.subjectId;

        Subject.findById(id, function(err, subject)
        {
          if (err) res.json({success:false,message:err});

         if(subject)
        {
             // change the subject
              subject.tenmon = req.body.tenmon;
              subject.loaimon = req.body.loaimon;

              // save the subject
              subject.save(function(err)
            {
                if (err) res.json({success:false,message:err});

                console.log('subject successfully updated!');
                res.json(subject);
            });
        }

        });

    });

    //thêm loại môn học
    router.post('/addCategorySubject', function(req,res){

        var newLoaiMon = new LoaiMon();

            // set the cate subject's
            newLoaiMon.loaimon = req.body.name;

           // save the cate subject
            newLoaiMon.save(function(err) {
                if (err){
                    console.log('Error in Saving cate: '+err);
                    throw err;
                }
                 res.json({success: true, message: "Thêm thành công loại môn: "+newLoaiMon.loaimon});
            });
    });

    //Xóa loại môn học
    router.post('/removeCategorySubject/:cateSubId', function(req,res)
    {
          var idCate = req.params.cateSubId;

          LoaiMon.findOneAndRemove({ _id: idCate }, function(err)
            {
              if (err)  res.json({success:false,message:err});

                        res.json({success:true, message: "Xóa loại môn học thành công"});
            });
    });

    //cập nhật loại môn học (hiển thị thông tin chỉnh sửa)
    router.post('/editCategorySubject/:cateId', function(req,res){

          var id = req.params.cateId;

          LoaiMon.findById(id, function(err, cate) {
              if (err) res.json({success:false, message:err});

                       res.json(cate);
            });
    });
    //cập nhật loại môn học
    router.post('/changeCategorySubject/:cateId', function(req,res)
    {
          var id = req.params.cateId;

        LoaiMon.findById(id, function(err, cate)
        {
          if (err) res.json({success:false,message:err});

         if(cate)
        {
              cate.loaimon = req.body.loaimon;

              cate.save(function(err)
            {
                if (err) res.json({success:false,message:err});

                         res.json({success:true, message: "Cập nhật loại môn học thành công"});
            });
        }

        });

    });

    //danh sách lọai môn học
    router.post('/listCategorySubject', function(req,res)
    {

          LoaiMon.find(function(err, allCategorySubject)
        {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
               console.log("can't load allCategorySubject"+err);

            res.json(allCategorySubject); // return all subject in JSON format
        });

    });

    //save send contact
    router.post('/sendContact', function(req,res,next)
    {
          var newContact = new Contact();
          //set value
          newContact.subject = req.body.subject;
          newContact.email = req.body.mail;
          newContact.message = req.body.message;

          //save
          newContact.save(function(err)
          {
            if(err)
                {
                    console.log("err"+err);
                }
                else
                {
                    res.json({success:true});
                }
          });
    });

    //load contact
    router.post('/loadContact', function(req,res)
    {

        Contact.loadContact(function(err, contact)
        {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                console.log("can't load contact"+err);

            res.json(contact); // return all subject in JSON format
        });

    });

    //view contact
    router.post('/viewContact/:id', function(req,res){

        var id = req.params.id;

          Contact.getContact(id,function(err, contact) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                console.log("can't load contact"+err);

            res.json(contact); // return all subject in JSON format
        });

    });

    //load feed back
    router.post('/loadFeedback', function(req,res)
    {

        Feedback.loadFeedbackSubject(function(err, feedback)
        {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                console.log("can't load feedback"+err);

            res.json(feedback); // return all subject in JSON format
        });
    });


    //Xóa feed
    router.post('/removeFeed/:feedId', function(req,res){

        var idFeed = req.params.feedId;

          Feedback.findOneAndRemove({_id: idFeed},function(err, feedback) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.json({success:false, message: "Không thể xóa nhu cầu học"+ err});

                res.json({success:true, message: "Xóa nhu cầu học thành công"});
        });

    });

    //load yêu cầu môn học của gia sư
    router.post('/loadMonhocGS', function(req,res)
    {

        monhocYC.loadByQuery({}, function(err, monhoc)
        {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                console.log("can't load feedback"+err);

            res.json(monhoc); // return all subject in JSON format
        });
    });

    //Xóa yêu cầu môn học của gia sư
    router.post('/removeYC/:monhocId', function(req,res){

        var idYC = req.params.monhocId;

          monhocYC.findOneAndRemove({_id: idYC},function(err, yc) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.json({success:false, message: "Không thể xóa yêu cầu học"+ err});

                res.json({success:true, message: "Xóa yêu cầu học thành công"});
        });

    });

    //thêm môn học từ nhu cầu
    router.post('/feedAddSub/:hocsinhUsername', function(req,res)
    {
        var usernameHS = req.params.hocsinhUsername;
        User.getUserByUsername(usernameHS, function(err, user)
        {
            if(err)
            {
                console.log("can't get user"+err);
                res.json({success: false, messagefeedAddSub: "Không thể lấy mail"+err});
            }
            if(user)
            {
                var newSubject = new Subject();

                newSubject.tenmon = req.body.subject;
                newSubject.loaimon = req.body.category;

                  newSubject.save(function(err, monhoc)
                  {
                    if (err)
                    {
                        console.log("can't load feedback"+err);
                    }
                    if(monhoc)
                    {
                        var mailOptions =
                        {
                        from: 'Mang Gia Su <tutor.ct.ctu@gmail.com>',
                        to: user.email,
                        subject: 'Thêm môn học mới từ yêu cầu của bạn',
                        text: '',
                        html: '<h2>Cảm ơn vì sự đóng góp của bạn</h2>'+'<br>Chúng tôi đã thêm môn :'+newSubject.tenmon+' thuộc loại: '+newSubject.loaimon+' vào hệ thống môn học'
                        }

                        transporter.sendMail(mailOptions, function(err, info)
                        {
                            if(err)
                            {
                                console.log(err);
                            } else
                            {
                                console.log('Email sent');
                            }
                        })
                        res.json({success: true, messagefeedAddSub: "Thêm thành công môn: "+ newSubject.tenmon+ " Loại: "+ newSubject.loaimon});
                    }
                });
            }

        });

    });

    //Thêm môn học từ yêu cầu của gia sư
    router.post('/addMonHocYC/:giasuUsername', function(req,res)
    {
        var usernameGiasu = req.params.giasuUsername;

        User.getUserByUsername(usernameGiasu, function(err, user)
        {
            if(err)
            {
                console.log("can't get user"+err);
                res.json({success: false, message: "Không thể lấy mail"+err});
            }
            if(user)
            {
                var newSubject = new Subject();

                newSubject.tenmon = req.body.tenmon;
                newSubject.loaimon = req.body.loaimon;

                  newSubject.save(function(err, monhoc)
                  {
                    if (err)
                    {
                        console.log("can't load feedback"+err);
                    }
                    if(monhoc)
                    {
                        var mailOptions =
                        {
                        from: 'Mang Gia Su <tutor.ct.ctu@gmail.com>',
                        to: user.email,
                        subject: 'Thêm môn học mới từ yêu cầu của bạn',
                        text: '',
                        html: '<h2>Cảm ơn vì sự đóng góp của bạn</h2>'+'<br>Chúng tôi đã thêm môn :'+newSubject.tenmon+' thuộc loại: '+req.body.loaimon+' vào hệ thống môn học'
                        }

                        transporter.sendMail(mailOptions, function(err, info)
                        {
                            if(err)
                            {
                                console.log(err);
                            } else
                            {
                                console.log('Email sent');
                            }
                        })
                        res.json({success: true, messagefeedAddSub: "Thêm thành công môn: "+ newSubject.tenmon+ " Loại: "+ newSubject.loaimon});
                    }
                });
            }

        });

    });

// LOGIN ADMIN

// dang nhap
router.post('/login',function(req,res)
{
    Admin.getAdminByEmail(req.body.email, function(err, admin)
    {
            if(!admin)
            {
                res.json({success: false, messagelogin:"Email invalid", admin: admin});
            } else if(admin)
            {
                Admin.comparePassword(req.body.password, admin.password, function(err, isMatch)
                {
                    if(err) console.log("can\'t compare"+err);
                    if(isMatch)
                    {
                        res.json({success: true, current_admin: admin._id, current_role: admin.role, current_mail: admin.email });
                    } else
                    {
                        res.json({success: false, messagelogin: "Password invalid"});
                    }
                })
            }
        })
});
//dang ki
 router.post('/register', function(req,res)
 {

    var newAdmin = new Admin();

        newAdmin.email = req.body.email;
        newAdmin.password = createHash(req.body.password);
        newAdmin.phone =  req.body.phone;
        newAdmin.name =  req.body.name;
        newAdmin.role =  'admin';
        newAdmin.date =  req.body.date;

       // save the admin
        newAdmin.save(function(err)
        {
            if (err)
            {
                console.log('Error in Saving user: '+err);
                res.json({success: false, messageRes:"Cant add new account" +err});
            }
            else
            {
                res.json({success: true, messageRes:"Register successfully"});
            }
        });
});

//load danh sách account
router.post('/loadAccount', function(req,res)
    {

        Admin.find(function(err, admin)
        {

            if (err)
                console.log("can't load admin"+err);

                res.json(admin);
        });
    });

//Xóa tài khoản
router.post('/removeAccount/:idAccount', function(req,res)
    {
        var id = req.params.idAccount;

        Admin.findOneAndRemove({ _id: id }, function(err, acc)
            {
              if (err)  res.json({success:false,message:err});

                        res.json({success:true, message: "Xóa thành công tài khoản "+acc.email});
            });
    });

//get profile admin
router.post('/profile/:idAdmin',function(req,res){
    var id = req.params.idAdmin;
    Admin.getAdminById(id, function(err, admin){
            if(!admin){
                res.json({success: false, messagelogin:"Email invalid", profileAdmin: admin});
            } else if(admin){
                console.log(admin);
                res.json(admin);
            }
        });
});

//edit profile admin editSecurityAdmin
router.post('/editProfileAdmin',function(req,res){
   Admin.getAdminByEmail(req.body.email, function(err, admin){
            if (err) res.json({success:false,message:err});

            // change the subject
              admin.name = req.body.name;
              admin.phone = req.body.phone;

              // save the subject
              admin.save(function(err) {
                if (err) res.json({success:false,message:err});

                console.log('admin successfully updated!');
                res.json(admin);
              });
        })
});
//edit Security admin
router.post('/editSecurityAdmin/:profileId',function(req,res){
   var id = req.params.profileId;
   var oldPass = req.body.oldPass;

    Admin.getAdminById(id, function(err, admin){
            if (err) res.json({success:false, messageUpdateSecur: 'Lỗi'+err});

            // check old password
            Admin.comparePassword(oldPass, admin.password, function(err, isMatch){
                    if(err)
                    {
                        res.json({success:false, messageUpdateSecur: 'Lỗi'+err});
                    }
                    if(isMatch){//isMatch true or false
                          admin.password = createHash(req.body.newpass);

                          admin.save(function(err) {
                            if (err)
                            {
                                console.log("cant update pass");
                                res.json({success:false, messageUpdateSecur: 'Không thể thay đổi mật khẩu lỗi'+err});
                            } else
                                {
                                    console.log('admin successfully updated!');
                                    res.json({success:true, messageUpdateSecur: 'Cập nhật thành công'+err});
                                }
                          });
                    } else {
                        res.json({success: false, messageUpdateSecur: 'Mật khẩu cũ không chính xác'});
                    }
                })
        });
});

// ma hoa mat khau
var createHash = function(password){
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

module.exports = router;