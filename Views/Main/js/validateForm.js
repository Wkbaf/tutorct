$(document).ready(function() {
	// cofirm password in editProfile form with jQuery plugin
    $("#editProfile").validate({
        rules:{
            email:{
                email: true,
                required: true
            },
            pwd: {
                required: true
            },
            new_pwd:{
                required: true,
                minlength: 8
            },
            con_pwd: {
                required: true,
                minlength: 8,
                equalTo: "#new_pwd"
            }
        },
        messages:{
            email:{
                email: "Vui lòng nhập email hợp lệ",
                required: "Vui nhập email"
            },
            pwd:{
                required:"Vui nhập mật khẩu hiện tại"
            },
            new_pwd:{
                required: "Vui nhập mật khẩu mới",
                minlength: "Mật khẩu phải có ít nhất 8 kí tự"
            },
            con_pwd:{
                required: "Vui nhập mật khẩu mới",
                minlength: "Mật khẩu phải có ít nhất 8 kí tự",
                equalTo: "Vui lòng nhập giống new password"
            }
        }
    });

    $("#resetPassword").validate({
        rules:{
            pwd: {
                required: true,
                minlength: 8,
            },
            con_pwd: {
                required: true,
                minlength: 8,
                equalTo: "#pwd"
            }
        },
        messages:{
            pwd:{
                required: "Vui nhập mật khẩu mới",
                minlength: "Mật khẩu phải có ít nhất 8 kí tự"
            },
            con_pwd:{
                required: "Vui nhập mật khẩu mới",
                minlength: "Mật khẩu phải có ít nhất 8 kí tự",
                equalTo: "Vui lòng nhập giống new password"
            }
        }
    });
});