var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var MonHoc = require('../Angular/Models/monhoc');
var GiaSu = require('../Angular/Models/giasu');
var Student = require('../Angular/Models/student');
var User = require('../Angular/Models/user');
var contactStudent = require('../Angular/Models/contactStudent');
var LienLac = require('../Angular/Models/lienlac');
var Feedback = require('../Angular/Models/feedback');
var ThayTro = require('../Angular/Models/ThayTro');
var LopHoc = require('../Angular/Models/lophoc');
var Thongbao = require('../Angular/Models/thongbao');
var ThaoLuan = require('../Angular/Models/ThaoLuan');

var nodemailer = require('nodemailer');
//for send mail
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'tutor.ct.ctu@gmail.com',
        pass: 'luanvan2017'
    }
});
transporter.on('log', console.log);



//save student (save both account of student and user)
    router.post('/regstudent',function(req,res,next)
    {
        // var tenmon = [];
        // var mons = req.body.mon;
        // //xử lí môn
        // mons.forEach(function(mon)
        // {
        //     if(mon!='null')
        //     {
        //         tenmon.push(mon);
        //     }
        // });
        var tenmon  = req.body.params.mon;
        var infoStudent  = req.body.params.studentInfo;

        var user = new User();
        user.username = infoStudent.username;
        user.password = infoStudent.pass;
        user.email = infoStudent.mail;
        user.avatar = 'noimage.png';
        user.role = "student";

        var newStudent = new Student();
        // set the student's local credentials
        newStudent.fullname = infoStudent.name;
        newStudent.phone = infoStudent.phone;
        newStudent.mail = infoStudent.mail;
        newStudent.ngaysinh = infoStudent.birthdate,
        newStudent.gender = infoStudent.gender;
        newStudent.quote = infoStudent.quote;
        newStudent.descr = infoStudent.descr;
        newStudent.noihoc = infoStudent.noihoc;
        newStudent.mon = tenmon;
        newStudent.diachi = infoStudent.diachi;
        newStudent.username = infoStudent.username;

        //save user
        user.save(function(err, user)
        {
            if(err)
            {
                console.log("cant save user"+err);
                // send angular
                res.json({success: false, messageReg: 'Username hoặc email đã tồn tại'});
            } else
            {
                // save the student
                newStudent.save(function(err, student)
                {
                    if (err)
                    {
                        console.log('Error in Saving student: '+err);
                        //rollback
                        user.remove({'username': user.username}, function(err)
                        {
                        if (!err)
                        {
                                res.json({success: false, messageReg: 'Hệ thống đang gặp sự cố không tạo tài khoản trong thời điểm này'+err});
                        } else
                            {
                                console.log("cant remove user"+err);
                                res.json({success: false, messageReg: 'Hệ thống đang gặp sự cố không tạo tài khoản trong thời điểm này'+err});
                            }
                        });
                    } else
                    {
                        // send mail
                        var mailOptions = {
                            from: 'Mang Gia Su <tutor.ct.ctu@gmail.com>',
                            to: user.email,
                            subject: 'Xác Nhận Tài Khoản Tại Tutor.ct',
                            text: 'Thân chào '+user.username+
                                    'Cảm ơn bạn đã đăng ký tài khoản Tutor.ct. ' +
                                    'Bạn vui lòng click vào link bên dưới để xác nhận tài khoản'+
                                    ' http://localhost:3000/active',
                            html: 'Xin chào <strong>'+user.username+ '</strong>,<br><br>'+
                                    'Cảm ơn bạn đã đăng ký tài khoản Tutor.ct. Bạn vui lòng click vào link bên dưới để xác nhận tài khoản'+
                                    '<br><a href="http://localhost:3000/#/active?username='+ user.username
                                    +'>'
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
res.json({success: true, messageReg: 'Da dang ky thanh cong'});
                    }
                });

            }
        });

    });

//get user by user for load avatar
//value : value of object ; username: value.username;object: object foreach; array push
//username to get user
function userByUser (value, username, object, array, res)
{
    User.getUserByUsername(username,function(err,userInfo)
      {
            if(err)
            {
                console.log("can't get user");
            }
            //if userInfo valid
            if(userInfo)
            {
                array.push({user: userInfo, value: value});
            }
            //if array is now full, send it; otherwise, wait for more
            if(array.length == object.length)
            {
                // array.forEach(function(item) { console.log("toi day"+item.user.avatar) });
                // console.log(array.length + '='+ object.length);
                res.json({success: true, array: array});
            }
      });
}

//search student by subjects
    router.post('/findStudentBySubject/:subjectSearch',function(req,res){
        var subject = req.params.subjectSearch;
        var studentInfo = [];
            Student.getAllStudentBySubject(subject, function(err, student){
            if (err)
                {
                    console.log("can't get subject"+err);
                }
            //subject null
            if(!student.length)
            {
                res.json({success: false, messageGetStudent: "Không có học sinh nào được tìm thấy"});
            }
            //success
            if(student.length)
            {
             student.forEach(function(value)
                {
                    userByUser (value, value.username, student, studentInfo, res);
                });
            }
        });
    });

//load student get all student
    router.post('/loadstudent',function(req,res)
    {
        var studentInfo = [];
        Student.find(function(err, allStudent)
        {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                {
                    console.log("can't get"+err);
                }
            //success allstudent == null
            if(!allStudent.length)
            {
                res.json({success: false, messageLoadStudent: "Không có học sinh nào được tìm thấy"});
            }
            //success allstudent
            if(allStudent.length)
            {
             allStudent.forEach(function(value)
                {
                    userByUser (value, value.username, allStudent, studentInfo, res);
                });

            }

        });
    });

// find student by username
router.post('/findstudentbyusername/:username', function(req, res, next){
    var username = req.params.username;
    Student.getStudentByUsername(username, function(err, student){
        if(err){
            console.log('findstudentbyusername '+err);
            res.json({success: false, student: null});
        } else {
            // console.log(student);
            res.json({success: true, student: student ? student:null});
        }
    })
});

// find student by id
router.get('/findstudentbyid/:id', function(req, res, next){
    var id = req.params.id;
    Student.getStudentById(id, function(err, student){
        if(err){
            console.log('findstudentbyid '+err);
            res.json({success: false, student: null});
        } else {
            // console.log(student);
            res.json({success: true, student: student ? student:null});
        }
    })
});

// contact to student {save contact to dbs}
router.post('/contactStudent/:studentUsername/:username', function(req, res, next)
{
    var studentUN = req.params.studentUsername;
    var username = req.params.username;//tutor username
    //get fulname by username
    GiaSu.getTutorByUsername(username,function(err,tutor)
    {
        if(err)
        {
            console.log("Cant get gia su"+err);
            res.json({success: false, messageContact: 'Hệ thống xảy ra lỗi. Chúng tôi không thể gửi liên lạc của bạn vào thời điểm này. Rất xin lỗi vì vấn đề này'});
        }
        if(tutor){
        var contactSt = new contactStudent();
        contactSt.studentUserName = studentUN;; //student username
        contactSt.tutorname = tutor.hoten; //full name tutor
        contactSt.tutorUsername = username; //tutor username
        contactSt.subject = req.body.subject;
        contactSt.message = req.body.message;
        contactSt.accept = 0;
        //save contactStudent
        contactSt.save(function(err)
        {
            if(err)
            {
                console.log("Send message faile contact to student"+err);
                // send angular
                res.json({success: false, messageContact: 'Có điều gì đó không đúng. Chúng tôi không thể gửi liên lạc của bạn. Rất xin lỗi vì vấn đề này'});
            } else
            {
                res.json({success: true, messageContact: 'Liên lạc của bạn đã gửi thành công. Chúng tôi đang chờ xác nhận của học sinh cảm ơn.'});
            }
        });
        }
    });

});

//check contact
router.post('/checkContact', function(req, res, next){console.log("toi day");
    // var studentUsername = req.params.studentUsername;
    // var current_user = req.params.current_user;
    // console.log(current_user);
    // contactStudent.loadMailStudentByStUN(current_user, studentUserName, function(err, contact){
    //     if(err){
    //          console.log('findstudentbyid '+err);
    //          res.json({success: false, contact: null});
    //     } else {
    //          console.log('contact');
    //          res.json({success: true, contact:contact});
    //     }
    // })
});

//load mailbox of student
router.post('/mailStudent/:username', function(req, res, next)
{
    var username  = req.params.username;
    var mailInfo = [];
    contactStudent.loadMailStudentByStudentUN(username,function(err, yourContact)
    {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                {
                    console.log('error get mail '+err);
                    res.json({success: false, messagemailStudent: 'Có điều gì đó không đúng, hệ thống không thể load mail'});
                }
            // console.log(yourContact[0]);
            if(yourContact)
            {
                yourContact.forEach(function(value)
                {
                    userByUser (value, value.tutorUsername, yourContact, mailInfo, res);
                });
            }
    });
});

//delete mailbox
router.get('/deleteMailbox', function(req, res, next)
{
    var mailId  = req.query.name;
    var times = 0;

    mailId.forEach(function(idMail)
    {
    // console.log(entry);
        contactStudent.getMailStudentById(idMail,function(err, mailDelete)
        {
            if (err)
                {
                    console.log('error get mail by mail id '+err);
                    res.json({success: false, messagemailStudent: 'Có điều gì đó không đúng, hệ thống không thể xóa mail'});
                }
            if(mailDelete)
            {
                mailDelete.delete = 1;
                mailDelete.save(function(err)
                {
                    if(err)
                    {
                        console.log("cant change status delete"+err);
                        res.json({success: false, messagemailStudent: 'Có điều gì đó không đúng, hệ thống không thể xóa mail'});
                    } else
                        {
                            times += 1;
                            if(times == mailId.length)
                            {
                                res.json({success: true, messagemailStudent: 'Hệ thống đã xóa mail bạn yêu cầu'});
                            }
                        }

                });
            }
        });
    });

});

//load sent mail student
router.post('/loadSentMail/:current_user', function(req, res, next)
{
    var username  = req.params.current_user;
    var sentMailInfo = [];
    var query = { 'hocsinh.hocsinh_username': username };
    LienLac.getContactByTutor(query,function(err, sentmail)
    {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err);
            if(sentmail)
            {
                sentmail.forEach(function(value)
                {
                    //get tutor username by tutor id
                    GiaSu.getTutorById(value.giasu, function(err, giasu)
                    {
                        if(err)
                        {
                            console.log("cant get gia su"+err);
                        }
                        if(giasu)
                        {
                            // userByUser (value, tutor.username, sentmail, mailInfo, res);
                            User.getUserByUsername(giasu.username,function(err,userInfo)
                            {
                                if(err)
                                {
                                    console.log("can't get user");
                                }
                                //if userInfo valid
                                if(userInfo)
                                {
                                    sentMailInfo.push({user: userInfo, value: value, tutor:giasu});
                                }
                                //if array is now full, send it; otherwise, wait for more
                                if(sentMailInfo.length == sentmail.length)
                                {
                                    res.json({success: true, array: sentMailInfo});

                                }
                            });
                        }
                    });
                });
            }
    });
});

//load profile student
router.post('/loadProfileStudent/:username', function(req, res, next){
    var username  = req.params.username;
    Student.getStudentByUsername(username,function(err,student){
        if(err) {
                console.log(err);
            } else {
                // console.log(student)
                res.json(student);
            }
    });

});

//update profile student
router.post('/updateProfileStudent/:username', function(req, res, next){
    var username  = req.params.username;
    Student.getStudentByUsername(username,function(err,updateStudent){
        if(err) {
                console.log(err);
            }
        if(updateStudent){
                // change the student
                  updateStudent.fullname = req.body.fullname;
                  updateStudent.phone = req.body.phone;
                  updateStudent.quote = req.body.quote;
                  updateStudent.descr = req.body.descr;
                  updateStudent.noihoc = req.body.noihoc;
                  // student.mon = req.body.mon;
                  updateStudent.diachi = req.body.diachi;

                  // save the student
                  updateStudent.save(function(err) {
                    if (err) res.json({success:false,message:err});

                    console.log('subject successfully updated!');
                    res.json({success: true, message: 'Send success'});
                  });
        }
    });

});


//load account student
router.post('/loadAccountStudent/:username', function(req, res, next){
    var username  = req.params.username;
    User.getUserByUsername(username,function(err,user){
        if(err) {
                console.log(err);
            } else {
                // console.log(user);
                res.json(user);
            }
    });

});

//update account student
router.post('/updateAccountStudent/:username', function(req, res, next)
{
    var username  = req.params.username;
    var current_pass = req.body.oldpassword;

    if(!current_pass)
    {
        console.log('pass cur null ');
        res.json({success: false, messageAccount: "Mật khẩu hiện tại của bạn không chính xác"});
    }
    if(current_pass)
    {
        User.getUserByUsername(username,function(err,user)
    {
        if(err)
        {
                console.log('can\'t get user '+err);
                res.json({success: false, messageAccount: "Có điều gì đó xảy ra. Hệ thống không thể xử lý yêu cầu của bạn"+err});
        } else
            {
                User.comparePassword(current_pass, user.password, function(err, isMatch)
                {
                    if(err)
                    {
                        console.log('can\'t compare pass '+err);
                        res.json({success: false, messageAccount: "Có điều gì đó xảy ra. Hệ thống không thể xử lý yêu cầu của bạn"});
                    }
                    if(!isMatch)
                    {
                        res.json({success: false, messageAccount: "Mật khẩu hiện tại bạn vừa nhập không chính xác"});
                    }
                    if(isMatch)
                    {
                        var new_pass = req.body.newpassword;
                        if(new_pass)
                        {
                            bcrypt.hash(new_pass, 10, function(err, hash)
                            {
                                if(err)
                                {
                                    console.log('can\'t hash pass '+err);
                                    res.json({success: false, messageAccount: "Có điều gì đó xảy ra. Hệ thống không thể xử lý yêu cầu của bạn"});
                                }
                                if(hash)
                                {
                                    var email = req.body.email;
                                    var value = {email: email, password: hash};
                                    User.updateUser(user._id, value, function(err, userUp)
                                    {
                                        if(err)
                                        {
                                            console.log('can\'t update pass '+err);
                                            res.json({success: false, messageAccount: "Có điều gì đó xảy ra. Hệ thống không thể xử lý yêu cầu của bạn"});
                                        } else
                                            {
                                                //find student and update email
                                                Student.getStudentByUsername(username,function(err,updateStudent)
                                                {
                                                    if(err)
                                                    {
                                                        console.log('can\'t update email student '+err);
                                                        res.json({success: false, messageAccount: "Có điều gì đó xảy ra. Hệ thống không thể xử lý yêu cầu của bạn"});
                                                    }
                                                    if(updateStudent)
                                                    {
                                                        //set value email
                                                        updateStudent.mail = email;

                                                        updateStudent.save(function(err)
                                                        {
                                                            if(err)
                                                            {
                                                                console.log('can\'t update email student '+err);
                                                                res.json({success: false, messageAccount: "Có điều gì đó xảy ra. Hệ thống không thể xử lý yêu cầu của bạn"});
                                                            }
                                                            res.json({success: true, messageAccount: "Những thay đổi của bạn đã được cập nhật"});
                                                        });
                                                    }
                                                });
                                            }
                                    });
                                }
                            });
                        }
                        //trường hợp không nhập pass
                        if(!new_pass)
                        {
                            var email = req.body.email;
                            var value = {email: email};
                            User.updateUser(user._id, value, function(err, userUp)
                            {
                                if(err)
                                {
                                    console.log('can\'t update email user  '+err);
                                    res.json({success: false, messageAccount: "Có điều gì đó xảy ra. Hệ thống không thể xử lý yêu cầu của bạn"});
                                }
                                if(userUp)
                                {
                                    //find student and update email
                                    Student.getStudentByUsername(username,function(err,updateStudent)
                                    {
                                        if(err)
                                        {
                                            console.log('can\'t update email student '+err);
                                            res.json({success: false, messageAccount: "Có điều gì đó xảy ra. Hệ thống không thể xử lý yêu cầu của bạn"});
                                        }
                                        if(updateStudent)
                                        {
                                            //set value email
                                            updateStudent.mail = email;

                                            updateStudent.save(function(err)
                                            {
                                                if(err)
                                                {
                                                    console.log('can\'t update email student '+err);
                                                    res.json({success: false, messageAccount: "Có điều gì đó xảy ra. Hệ thống không thể xử lý yêu cầu của bạn"});
                                                }
                                                res.json({success: true, messageAccount: "Những thay đổi của bạn đã được cập nhật"});
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
    });
    }
});

//view Mail student by id mail
router.post('/viewmail/:id', function(req, res, next){
    var mailId  = req.params.id;
    contactStudent.getMailStudentById(mailId,function(err,mail){
        if(err) {
                console.log(err);
            } else {
                // console.log("detail0"+mail);
                res.json(mail);
            }
    });

});

//accept mail by id mail
router.post('/mailAccept/:mailId', function(req,res)
{
        var id = req.params.mailId;
        contactStudent.getMailStudentById(id, function(err, mail)
        {
          if (err)
            {
                console.log("can't get mail id"+err);
                res.json({success:false,messageAccept:'Hệ thống đang xảy ra sự cố, chúng tôi rất tiếc không thể xử lí tác vụ của bạn'});
            }

         if(mail)
            {
                //kiểm tra coi hai oog gia sư vs hoc sinh có mối quan hệ chưa
                var query = {'giasu.gs_username': mail.tutorUsername, 'hocsinh.hs_username': mail.studentUserName};
                ThayTro.getOneThayTroByQuery(query, function(err, thaytro)
                {
                    if(err)
                    {
                        console.log("cant load mail with student username and tutor user name"+err);
                        res.json({success:false,messageAccept:'Hệ thống đang xảy ra sự cố, chúng tôi rất tiếc không thể xử lí tác vụ của bạn'});
                    }
                    if(!thaytro)
                    {
                        // change the status mail
                        mail.accept = 1;//mail accepted
                        // update the mail
                        mail.save(function(err)
                        {
                        if (err)
                        {
                            console.log("can 't accepted mail::::::"+err);
                            res.json({success:false,messageAccept:'Hệ thống đang xảy ra sự cố, chúng tôi rất tiếc không thể xử lí tác vụ của bạn'});
                        } else
                            {
                                //ssave mối qh vào model ThayTro
                                Student.getStudentByUsername(mail.studentUserName, function(err, st){
                                    var thaytro = new ThayTro();
                                    thaytro.giasu.gs_username = mail.tutorUsername;
                                    thaytro.giasu.gs_hoten = mail.tutorname;
                                    thaytro.hocsinh.hs_username = mail.studentUserName;
                                    thaytro.hocsinh.hs_id = st._id;

                                    thaytro.save(function(err)
                                    {
                                        if(err)
                                        {
                                            console.log("cant save to collection thaytro"+err);
                                            // send angular
                                            res.json({success: false, messageAccept: 'Hệ thống xảy ra lỗi. Chúng tôi không thể gửi liên lạc của bạn vào thời điểm này. Rất xin lỗi vì vấn đề này'});
                                        } else
                                        {
                                            console.log('mail successfully updated!');
                                            res.json({success:true,messageAccept:'Bạn đã chấp nhận thành công. Hệ thống sẽ gửi thông báo đến gia sư'});
                                        }
                                    });
                                })
                            }
                        });
                    }
                    if(thaytro)
                    {
                        res.json({success:false,messageAccept:'Bạn đã chấp nhận yêu cầu của gia sư này rồi'});
                    }
                });
            console.log("mail by mail id::::"+mail);

            }

        });
});

//deny mail by id mail
router.post('/mailDeny/:mailId/:reason', function(req,res)
{
      var id = req.params.mailId;
      var reason = req.params.reason;
      // console.log("id mail" +id);
        contactStudent.getMailStudentById(id, function(err, mail)
        {
          if (err) console.log("can't get mail id"+err);

         if(mail)
            {
            console.log("mail by mail id::::"+mail);
             // change the status mail
              mail.accept = 2;//mail deny status
              mail.contentDeny = reason;

              // update the mail
              mail.save(function(err)
                {
                if (err) console.log("can 't accepted mail::::::"+err);

                console.log('mail successfully updated!');
                res.json({success:true,messageAccept:'You refused mail successfull!!!'});
                });
            }

        });
});

//load tutor accepted
router.post('/tutorAccept/:current_user', function(req, res, next)
{
    var studentUsername = req.params.current_user;

    ThayTro.getThayTroByQuery({'hocsinh.hs_username':studentUsername}, function(err,mail)
    {
        var mailInfo = [];
        if(err)
        {
            console.log("can't load tutor accepted"+err);
        }
         else
            {
                // console.log("load tutor accepted");console.log("toi day"+mail);
                mail.forEach(function(value){
                    userByUser (value, value.giasu.gs_username, mail, mailInfo, res);
                });
            }
    });

});

// release tutor
router.post('/releaseTutor/:tutorUsername/:current_user', function(req, res, next)
{
    var tutorUsername = req.params.tutorUsername;
    var current_user = req.params.current_user;
    contactStudent.loadMailStudentByStUN(tutorUsername, current_user, function(err,mail)
    {
        if(err)
        {
            console.log("cant load tutor accepted"+err);
            res.json({success:false, messageRelease:'Hệ thống đang xảy ra sự cố, chúng tôi rất tiếc không thể xử lí tác vụ của bạn'});
        }
        if(mail)
        {
            // đặt lại trạng thái mail là deny
            mail.accept = 2;
            mail.save(function(err)
                {
                    if(err)
                    {
                        console.log("cant change status mail"+err);
                        res.json({success:false,messageRelease:'Hệ thống đang xảy ra sự cố, chúng tôi rất tiếc không thể xử lí tác vụ của bạn'});
                    } else
                        {
                            //remove in thaytro collection
                            var query = {'giasu.gs_username': tutorUsername, 'hocsinh.hs_username': current_user};
                            ThayTro.remove(query, function(err)
                            {
                            if (!err)
                            {
                                    res.json({success:true,messageRelease:'Bạn vừa hủy liên lạc thành công với gia sư: '+tutorUsername});
                            } else
                                {
                                    console.log("cant change status mail"+err);
                                    res.json({success:false,messageRelease:'Hệ thống đang xảy ra sự cố, chúng tôi rất tiếc không thể xử lí tác vụ của bạn'});
                                }
                            });
                        }

                });
        }
    });

});

//view tutor (Xem thông tin chi tiết gia sư)
router.post('/viewTutor/:username', function(req, res, next)
{
    var username  = req.params.username;
    GiaSu.getTutorByUsername(username,function(err,tutor)
    {
        if(err)
        {
                console.log(err);
        } else
        {
            var query = {'giasu': tutor._id};
            // res.json(tutor);
            LopHoc.getClassByQuery(query, function(err, lop)
            {
                if(err)
                {
                    console.log("Không thể lấy danh sách lớp "+err);
                } else
                {
                    res.json({tutor: tutor, lop: lop});
                }
            });
        }
    });

});

//feed back subject (save feed)
router.post('/feedbackSubject/:current_user/:yourSubject', function(req, res, next){
        var current_user = req.params.current_user;
        var subject = req.params.yourSubject;
        var newsubject = req.body.newsubject;
        var feedback = new Feedback();
        // set the feedback
        //if subject not found == subject new
        if(newsubject)
        {
            feedback.studentname = current_user;
            feedback.subject = newsubject;
        }
        //if subject
        if(!newsubject)
        {
            feedback.studentname = current_user;
            feedback.subject = subject;
        }
        // feedbackSubject.content = req.body.name;

        //save feedback
        feedback.save(function(err, feed){
            if(err) {
                console.log("can't save feed"+err);
                // send angular
                res.json({success: false, messageFeedback: 'Send message faile contact to student'});
            } else {
                res.json({success: true, messageFeedback: 'Bạn vừa đăng nhu cầu với môn: '+feedback.subject+' Xin cảm ơn', nhucau: feed});
            }
        });

});

//load feedback subjects
router.post('/loadFeedbackSubject', function(req, res, next)
{
        Feedback.loadFeedbackSubject(function(err, feedbackSubject)
        {
            if(err) console.log("can't load feedback"+err);
            if(feedbackSubject)
            {
                res.json(feedbackSubject);
                console.log(feedbackSubject);
            }
        });

});

//load list class
router.post('/listClass/:studentUserName', function(req, res, next)
{
        var studentUserName = req.params.studentUserName;
        var query = {'hocsinh.hs_username': studentUserName};
        LopHoc.getAllClassByQuery(query, function(err, listClass)
        {
            if(err) console.log("can't load class"+err);
            if(listClass)
            {
                // console.log(listClass);
                res.json({success: true, listClass: listClass});
            }
        });
});

//view lớp học
router.post('/viewClass/:lopId', function(req, res, next)
{
        var idLop = req.params.lopId;

        // var query = {'hocsinh.hs_username': studentUserName};
        LopHoc.getClassById(idLop, function(err, lopHS)
        {
            var lopHocsinhArray = lopHS.hocsinh;//mảng học sinh đã đăng kí theo lớp
            var hocsinhArray = [];
            if(err) console.log("can't load class"+err);
            if(lopHS)
            {
                lopHocsinhArray.forEach(function(value)
                {
                    // lấy thông tin hoc sinh theo mảng hs trên
                    Student.getStudentById(value.hs_id, function(err, hocsinh)
                    {
                        if(err)
                        {
                            console.log("loi khong the get student"+err);
                        }
                        if(hocsinh)
                        {
                            User.getUserByUsername(value.hs_username, function(err, user)
                            {
                                if(err)
                                {
                                    console.log("loi khong the get user"+err);
                                }
                                if(user)
                                {
                                    hocsinhArray.push({hocsinh: hocsinh, user: user});
                                }
                                if(hocsinhArray.length == lopHocsinhArray.length)
                                {
                                    res.json({success: true, danhsachHS: hocsinhArray});
                                }
                            });
                        }
                    });
                });
            }
        });
});

//load THông báo của lớp học
router.post('/viewThongBao/:lopId', function(req, res, next)
{
        var idLop = req.params.lopId;
        Thongbao.getAnnByQuery({'lop': idLop}, function(err, thongbao)
        {
            if(err)
            {
                console.log("can't load thong bao"+err);
                res.json({success: false, messageThongbao: 'Không thể load thông báo. Lỗi '+err});
            }
            if(thongbao.length)
            {
                res.json({success: true, classThongBaoArray: thongbao});
            }
            if(!thongbao.length)
            {
                res.json({success: false, messageThongbao: 'Lớp học hiện không có thông báo nào'});
            }
        });
});

router.post('/viewThaoluan/:lopId', function(req, res, next)
{
        var idLop = req.params.lopId;
        ThaoLuan.getThaoLuanByQuery({'lop': idLop}, function(err, thaoluan)
        {
            if(err)
            {
                console.log("can't load thao luan"+err);
                res.json({success: false, messageThaoluan: 'Không thể load thảo luận. Lỗi '+err});
            }
            if(thaoluan.length)
            {
                res.json({success: true, thaoLuanArray: thaoluan});
            }
            if(!thaoluan.length)
            {
                res.json({success: false, messageThaoluan: 'Lớp học hiện không có thảo luận nào'});
            }
        });
});

//load list listFeed
router.post('/listFeed/:studentUserName', function(req, res, next)
{
        var studentUserName = req.params.studentUserName;
        Feedback.loadFeedbackByUsername(studentUserName, function(err, listFeed)
        {
            if(err) console.log("can't load feed"+err);
            if(listFeed)
            {
                // console.log(listFeed);
                res.json({success: true, listFeed: listFeed});
            }
        });
});

//load list listFeed
router.post('/deleteFeed/:id/:feedSubject', function(req, res, next)
{
        var feedId = req.params.id;
        var feedSubject = req.params.feedSubject;
        Feedback.remove({_id: feedId}, function(err, feedback)
        {
            if(err)
            {
                console.log("can't remove feed"+err);
            } else
            {
                res.json({success: true, messageRemoveFeed: "Bạn vừa xóa thành công nhu cầu môn: "+ feedSubject});
            }
        });
});

//rating
router.post('/rateFunction/:diem/:username/:tutorUsername', function(req, res, next)
{
        var diem = req.params.diem;
        var studentUsername = req.params.username;
        var tutorUsername = req.params.tutorUsername;
        // console.log(tutorId);
        var query = {'danhgia': {'user_rating':  studentUsername, 'rating': diem }};

        GiaSu.findOneAndUpdate({'username': tutorUsername}, { "$push": query }, function(err, tutor)
        {
            if(err)
            {
                console.error('ERROR!'+err);
                res.json({success: false, messagerating: "Hệ thống không thể xử lí yêu cầu của bạn. Lỗi: "+err});
            }
            else{
                res.json({success: true, messagerating: "Bạn vừa đánh giá gia sư với số điểm:  "+diem});
            }
        });
});

//rating lớp học
router.post('/rateClassFunction/:lopId/:username', function(req, res, next)
{
        var idLop = req.params.lopId;
        var studentUsername = req.params.username;
        // console.log("fdsafdsa"+JSON.stringify(req.body));
        var query = {'danhgia': {'hs_username':  studentUsername, 'khanang': req.body.khanang, 'tinhthan':req.body.tinhthan, 'phuongphap': req.body.phuongphap,  'tucach': req.body.tucach}};

        LopHoc.findByIdAndUpdate(idLop, { "$push": query }, function(err, tutor)
        {
            if(err)
            {
                console.error('ERROR!'+err);
                res.json({success: false, messagerating: "Hệ thống không thể xử lí yêu cầu của bạn. Lỗi: "+err});
            }
            else{
                res.json({success: true, messagerating: "Bạn vừa đánh giá lớp học thành công  "});
            }
        });
});

//add comment thông báo
router.post('/AddComment/:thongbaoDonId/:current_user/:current_role/:avatar', function(req, res, next)
{
        var idThongbao1 = req.params.thongbaoDonId;
        var current_user = req.params.current_user;
        var current_role = req.params.current_role;
        var avatar = req.params.avatar;
        var query = {'comment': {'user':  current_user, 'avatar': avatar, 'content': req.body.comment, 'role': current_role}};
        var contentComment = {'user':  current_user, 'avatar': avatar, 'content': req.body.comment, 'role': current_role};

        Thongbao.findByIdAndUpdate(idThongbao1, { "$push": query }, function(err, thongbao)
        {
            if(err)
            {
                console.error('ERROR!'+err);
                // res.json({success: false, messageComment: "Hệ thống không thể xử lí yêu cầu của bạn. Lỗi: "+err});
            }
            else{
                res.json({success: true, contentComment: contentComment});
            }
        });
});

//add trả lời thảo luận
router.post('/AddThaoluan/:thaoluanId/:current_user/:avatar', function(req, res, next)
{
        var idThaoluan = req.params.thaoluanId;
        var current_user = req.params.current_user;
        var avatar = req.params.avatar;
        var query = {'response': {'respondent':  current_user, 'avatar': avatar, 'answer': req.body.thaoluan}};
        var traloiThaoluan = {'respondent':  current_user, 'avatar': avatar, 'answer': req.body.thaoluan};
        ThaoLuan.findByIdAndUpdate(idThaoluan, { "$push": query }, function(err, thaoluan)
        {
            if(err)
            {
                console.error('ERROR!'+err);
                // res.json({success: false, messageComment: "Hệ thống không thể xử lí yêu cầu của bạn. Lỗi: "+err});
            }
            else{
                res.json({success: true, contentThaoluan: traloiThaoluan});
            }
        });
});

//check liên lạc thầy trò coi đã tôn tại chưa
router.post('/checkThaytro/:studentUsername/:current_user', function(req, res, next)
{
        var studentUsername = req.params.studentUsername;
        var tutorUsername = req.params.current_user;
        var queryThaytro = {'giasu.gs_username': tutorUsername, 'hocsinh.hs_username': studentUsername};

        ThayTro.getOneThayTroByQuery(queryThaytro, function(err, thaytro)
        {
            if(err)
            {
                console.error('ERROR!'+err);
                // res.json({success: false, messageComment: "Hệ thống không thể xử lí yêu cầu của bạn. Lỗi: "+err});
            }
            if(!thaytro)//null == chưa có liên lạc với hs này
            {
                res.json({success: true, messageThaytro: 'Có thể liên lạc'});
            }
            if(thaytro)
            {
                res.json({success: false, messageThaytro: 'Liên lạc của bạn đã được chấp nhận. <br> Bạn không cần gửi lại lần nữa'});
            }
        });
});

//ma hoa mat khau
var createHash = function(password){
    return bcrypt.hashSync(password, 10, null);
};
module.exports = router;
