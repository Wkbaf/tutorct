var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var secret = 'citctu'; // dung de ma hoa jwt

var GiaSu = require('../Angular/Models/giasu');
var User = require('../Angular/Models/user');
var MonHoc = require('../Angular/Models/monhoc');
var mongoose = require('mongoose');
var Student = require('../Angular/Models/student');

var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Views/Main/upload'); // file se luu vao day
  },
  filename: function(req, file, cb){
    // chi lay file cua .ext = png|jpg|jpeg
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
            var err = new Error();
            err.code = 'filetype';
            return cb(err);
        } else {
            // dat ten cho file anh vua upload
            cb(null, Date.now() + '-' +file.originalname);
        }
    }
});

var upload = multer({
    storage: storage,
    limits: {fileSize: 100000000} // kich thuoc file <= 10MB
}).single('myfile'); // myFile la name cua input [type=file]


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'tutor.ct.ctu@gmail.com',
        pass: 'luanvan2017'
    }
});
transporter.on('log', console.log);

// upload avatar
router.post('/upload', function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            console.log(err);
            if (err.code === 'LIMIT_FILE_SIZE') {
                console.log('large' + err);
                res.json({ success: false, message: 'File quá lớn. Chọn file có dung lượng dưới 10MB' });
            } else if (err.code === 'filetype') {
                console.log('wrong ext' + err);
                res.json({ success: false,
                    message: 'Vui lòng chọn file .png hoặc.jpg hoặc .jpeg' });
            } else {
                res.json({ success: false, message: "Không thể upload file" });
            }
        } else {
            if (!req.file) {
                res.json({ success: false, message: "Vui lòng chọn file" });
            } else {
                var id = req.body.userid;
                var imageName = req.file.filename;
                var value = {avatar: imageName};
                User.updateUser(id, value, function(err, user){
                    if(err){
                        console.log(err);
                        res.json({success: false, message: 'Không thể cập nhật user'});
                    }
                    res.json({success: true, message: "Upload avatar thành công"});
                });
            }
        }
    })
});

// lay danh sach mon hoc
router.get('/btutor', function(req, res, next) {
    MonHoc.listMonHoc(function(err, monhoc) {
        if (err) {
            console.log(err);
            res.json({ success: false, message: err });
        } else {
            res.json(monhoc);
        }
    })
});

// dang ky lam gia su - become tutor
router.post('/btutor', function(req, res, next) {

    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    user.avatar = 'noimage.png';
    user.role = "giasu";

    var giaSu = new GiaSu({
        hoten: req.body.hoten,
        ngaysinh: req.body.ngaysinh,
        thayco: req.body.thayco,
        username: req.body.username,
        password: req.body.password,
        // email: req.body.email,
        diachi: req.body.diachi,
        sdt: req.body.sdt,
        noicongtac: req.body.noicongtac,
        kinhnghiem: req.body.kinhnghiem,
        noiday: req.body.noiday,
        daymon: req.body.daymon

    });

    user.save(function(err) {
        if (err) {
            console.log(err);
            // gui thong tin sang angular
            res.json({ success: false, message: 'Username hoặc email đã tồn tại' });
        } else {
            giaSu.save(function(err) {
                if (err) {
                    console.log(err);
                } else {
                    // gui email xac nhan dang ky
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
                                +'>http://localhost:3000/#/active</a>'
                    }
                    transporter.sendMail(mailOptions, function(err, info){
                        if(err){
                            console.log(err);
                        } else{
                            console.log('Email sent');
                        }
                    })
                    res.json({ success: true, message: 'Da dang ky thanh cong' });
                }
            });
        }
    });

});

// cap nhat trang thai active khi user click vao link trong email
router.post('/active/:username', function(req, res){
    var username = req.params.username;
    User.getUserByUsername(username, function(err, user){
        if(err) throw err;
        var query = { username: username};
        var value = {active: true};
        User.updateUserByQuery(query, value, function(err, user){
            if(err) throw err;
            console.log('update active');
            res.json({success: true, message: 'Account is actived'});
        })
    })
});

// resend active email
router.post('/resendemail', function(req, res){
    var username = req.body.username;
    console.log(username);
    User.getUserByUsername(username, function(err, user){
        if(err){
            console.log(err);
            res.json({success: false, message: 'Không tìm thấy username'});
        } else {
            var mailOptions = {
                from: 'Mang Gia Su <tutor.ct.ctu@gmail.com>',
                to: user.email,
                subject: 'Xác Nhận Tài Khoản Tại Tutor.ct',
                text: 'Thân chào '+username+
                        'Cảm ơn bạn đã đăng ký tài khoản Tutor.ct. ' +
                        'Bạn vui lòng click vào link bên dưới để xác nhận tài khoản'+
                        ' http://localhost:3000/active',
                html: 'Xin chào <strong>'+username+ '</strong>,<br><br>'+
                        'Cảm ơn bạn đã đăng ký tài khoản Tutor.ct. Bạn vui lòng click vào link bên dưới để xác nhận tài khoản'+
                        '<br><a href="http://localhost:3000/#/active?username='+ username
                        +'>http://localhost:3000/#/active</a>'
            }
            transporter.sendMail(mailOptions, function(err, info){
                if(err){
                    console.log(err);
                    res.json({success: false, message: 'Không thể gửi lại email'});
                } else{
                    console.log('Email resent');
                    res.json({success: true, message: 'Đã gửi lại email xác nhận'});
                }
            })
        }
    })
});

// get user's email and send email for forgotpassword uc
router.put('/forgotpwd/:email', function(req, res, next){
    var email = req.params.email;
    console.log('email ', email);
    User.findOne({email: email}, function(err, user){
        if(err){
            res.json({success: false, message: err});
        } else {
            if(!user) {
                res.json({success: false, message: "Không tìm thấy email"});
            } else {
                var payload = {username: user.username, email: user.email};
                user.resettoken = jwt.sign(payload, secret, { expiresIn: '24h' });
                user.save(function(err, user){
                    if(err){
                        console.log(err);
                        res.json({success:false, message: 'Ko the update token'});
                    } else {
                        console.log('update');
                        var mailOptions = {
                            from: 'Mang Gia Su <tutor.ct.ctu@gmail.com>',
                            to: user.email,
                            subject: 'Đặt Lại Mật Khẩu Tại Tutor.ct',
                            text: 'Xin chào '+user.username+ ', Để đặt lại mật khẩu bạn click vào link http://localhost:3000/#/resetpassword.'+
                                    'Link này chỉ có hiệu lực trong 24 giờ và chỉ có thể sử dụng 1 lần',
                            html: '<p>Xin chào '+user.username+ ',</p><br/><p>Để đặt lại mật khẩu bạn click vào link</p><br/> <a href="http://localhost:3000/#/resetpassword?resettoken='+ user.resettoken
                                    +'>http://localhost:3000/#/resetpassword</a> <br/><p>Link này chỉ có hiệu lực trong 24 giờ và chỉ có thể sử dụng 1 lần</p><br>'+
                                    '<p>* Nếu việc yêu cầu đổi mật khẩu này không do bạn làm thì bạn chỉ cần bỏ qua email này.</p>'
                        }
                        transporter.sendMail(mailOptions, function(err, info){
                            if(err){
                                console.log(err);
                                res.json({success: false, message: 'Không thể gửi email'});
                            } else{
                                console.log('Email resent');
                                res.json({success: true, message: 'Đã gửi link đổi mật khẩu vào email của bạn'});
                            }
                        });
                    }
                });
            } // else
        }
    })
});

// verify token
router.get('/verifytoken/:resettoken', function(req, res){
    User.findOne({resettoken: req.params.resettoken}, function(err, user){
        if(err) {
            console.log(err);
            res.json({success: false, message: "Khong tim thay user"});
        } else {
            var token = req.params.resettoken;
            jwt.verify(token, secret, function(err, decoded) {
                if(err){
                    console.log(err);
                    res.json({success: false, message:"Link này không tồn tại hoặc đã quá 24 tiếng"});
                } else {
                    res.json({success: true, user: user});
                }
            });
        }
    })
});
// reset password
router.post('/resetpassword', function(req, res){
    console.log('resetpassword');
    var username = req.body.username;
    console.log('username', req.body.username);
    User.getUserByUsername(username, function(err, user){
        if(err) {
            console.log(err);
            res.json({success: false, message: "Khong tim thay user"});
        } else {
            var newPassword = req.body.password;
            bcrypt.hash(newPassword, 10, function(err, hash){
                if(err) return err;
                // var id = user._id;
                // console.log('user_id', id);
                var query = {username: username};
                var value = { password: hash, resettoken: false};
                User.updateUserByQuery(query, value, function(err, user){
                    if(err){
                        console.log(err);
                        res.json({success: false, message: "Không thể cập nhật lại mật khẩu"});
                    } else {
                        res.json({success: true, message: "Đổi mật khẩu thành công"});
                    }
                })
            });
        }
    })
});

// find user by username
router.get('/finduserbyusername/:username', function(req, res, next) {
    var username = req.params.username;
    User.getUserByUsername(username, function(err, user) {
        console.log("username " + username);
        if (err) {
            res.json({ success: false, message: err });
        } else {
            res.json({ success: true, user: user });
        }
    });
});
/********   authentication  ***********/
// logout
router.get('/logout', function(req, res) {
    req.logout(); // ham cua passport
    console.log('logout success');
    res.redirect('/');
});
// login va hien thi loi
router.post('/login', function(req, res, next ){
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err) }
      if (!user) { return res.json( { message: info.message }) }
      res.json({ success: true, message: "Dang nhap thanh cong", user: user});
    })(req, res, next);   
});
// cau hinh passport de login
passport.use(new LocalStrategy(function(username, password, done) {
    User.getUserToLogin(username, function(err, user) {
        if (err) throw err;
        if (!user) { //if user ko ton tai
            return done(null, false, { message: 'Tên đăng nhập không tồn tại' });
        }      
        User.comparePassword(password, user.password, function(err, isMatch) {
            if (err) throw err;
            if (isMatch) {
                // kiem tra nguoi dung da active chua
                if(user.active === false){
                    return done(null, false, { message: 'Tài khoản chưa active. Bạn vui lòng đăng nhập vào email để active'});
                } else if(user.vipham > 3){
                    // tai khoan bi bao cao vi pham --> bi khoa
                    return done(null, false, { message: 'Tài khoản của bạn đã bị khóa.'});                    
                }
                return done(null, user);
            } else {
                return done(null, false, { message: "Mật khẩu không đúng" });
            }
        });      
    });
}));

// thiet lap passport
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});
module.exports = router;