  //Angular Starter App
var main = angular.module("main", ['ui.router','ngRoute','ngResource', 'ngLetterAvatar',
    'ui.bootstrap','firebase', 'data-table', 'textAngular' ])
.run(function($http,$rootScope, $location, $state)
{
    //defining global veriables
    $rootScope.logUrl ='';
    $rootScope.roles = [{
		  name: "admin",
          code: 0
	   }, {
		  name: "giasu",
          code: 1
	   }, {
		  name: "student",
          code: 2
	}];

    //roles enum for authorization
    $rootScope.AuthenticRoles = {
      admin: "admin",
      giasu: "giasu",
      student: "student"
    };
    $rootScope.routeForUnauthorizedAccess = 'unauth';


    //Checking current session value
    if(sessionStorage.length > 0){
        $rootScope.current_user = sessionStorage.current_user;
        $rootScope.current_role = sessionStorage.current_role;
        $rootScope.sess = sessionStorage.sess;
        $rootScope.authenticated = true;
    }else{
        $rootScope.authenticated = false;
        $rootScope.current_user = 'Guest';
    }

    $rootScope.logout = function(){
        $http.get('auth/logout');
        $rootScope.authenticated = false;
        $rootScope.current_user = 'Guest';
        $rootScope.current_role = 'Guest'
        sessionStorage.clear();
        $location.path('/');
    };

    // kiem tra nguoi dung da login chua, neu chua thi ko the truy cap
    $rootScope.checkLogin = function(){
        if(!$rootScope.authenticated){
            $location.path('/unauth');
        }
        // kiem tra quyen truy cap cua user d/v link
        var url = $state.current.url;
        var str = "/"+$rootScope.current_role;
        // console.log('rootScope ', str);
        // console.log(url.startsWith(str));

        if(!url.startsWith(str)){
            $rootScope.logUrl = url;
            $location.path('/unauth');           
           
            alert($rootScope.logUrl);
        } 
        // console.log(url.startsWith(str));
    }

});

//Routing Configuration (define routes)
main.config([
    '$stateProvider', '$urlRouterProvider', '$httpProvider',
    function ($stateProvider, $urlRouterProvider,$rootScope,$routeProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'index.html',
                caseInsensitiveMatch: true,
                controller: 'tutorController'
                // controller: 'MainController'
            })
            .state('contact', {
                url: '/contact',
                templateUrl: 'contact.html',
                caseInsensitiveMatch: true,
                controller: 'MainController'
            })
            .state('about', {
                url: '/about',
                templateUrl: 'About.html',
                caseInsensitiveMatch: true
                // controller: 'MainController'
            })
            .state('login',{
                url: '/login',
                templateUrl: 'login.html',
                caseInsensitiveMatch: true,
                controller: 'AuthController'
            })
            .state('btutor',{
                url: '/btutor',
                templateUrl: 'btutor.html',
                caseInsensitiveMatch: true,
                controller: 'AuthController'
            })
            .state('bstudent',{
                url: '/bstudent',
                templateUrl: 'bstudent.html',
                caseInsensitiveMatch: true,
                controller: 'StudentController'
            })
            .state('regitersuccess', {
                url: '/registersuccess',
                templateUrl: 'registerSuccess.html',
                caseInsensitiveMatch: true
                // controller: 'MainController'
            })
            .state('active',{
                url: '/active?username',
                templateUrl: 'activation.html',
                caseInsensitiveMatch: true,
                controller: 'EmailController'
            })
            .state('resendactivetutor',{
                url: '/giasu/resendactive',
                templateUrl: 'resendActiveAcc.html',
                caseInsensitiveMatch: true,
                controller: 'AuthController'
            })
            .state('resendactivestudent',{
                url: '/student/resendactive',
                templateUrl: 'resendActiveAcc.html',
                caseInsensitiveMatch: true,
                controller: 'AuthController'
            })
            .state('forgotpassword',{
                url: '/forgotpassword',
                templateUrl: 'forgotPassword.html',
                caseInsensitiveMatch: true,
                controller: 'passwordCtrl'
            })
            .state('resetpassword',{
                url: '/resetpassword?resettoken',
                templateUrl: 'resetPassword.html',
                caseInsensitiveMatch: true,
                controller: 'resetPwdCtrl'
            })
            .state('ftutor',{
                url: '/ftutor',
                templateUrl: 'ftutor.html',
                caseInsensitiveMatch: true,
                controller: 'tutorController'
            })
            .state('fstudent',{
                url: '/fstudent',
                templateUrl: 'fstudent.html',
                caseInsensitiveMatch: true,
                controller: 'StudentController'
            })
            .state('privatechat',{
                url: '/privatechat',
                templateUrl: 'chat.html',
                caseInsensitiveMatch: true,
                controller: 'tutorController'
            })
            // .state('search',{
            //     url: '/search',
            //     templateUrl: 'index2.html',
            //     caseInsensitiveMatch: true,
            //     controller: 'AuthController'
            // })
            // http://localhost:3000/#/tutor
            // tutor dashbroad
            .state('giasu',{
                url: '/giasu',
                templateUrl: '/giasu/index.html',
                controller: 'tutorController',
                caseInsensitiveMatch: true

            })
            .state('student',{
                url: '/student',
                templateUrl: '/student/index.html',
                controller: 'AuthController',
                caseInsensitiveMatch: true
            })
            // .state('giasuinfo',{
            //     url: '/giasu/info?giasuId',
            //     templateUrl: '/giasu/info.html',
            //     controller: 'tutorController',
            //     caseInsensitiveMatch: true
            // })
            .state('studentlist',{
                url: '/giasu/danhsachhocsinh',
                templateUrl: '/giasu/student/studentList.html',
                controller: 'tutorController',
                caseInsensitiveMatch: true
            })
            .state('studentdetail',{
                url: '/giasu/studentdetail?studentId',
                templateUrl: '/giasu/student/studentDetail.html',
                controller: 'tutorController',
                caseInsensitiveMatch: true
            })
            .state('contactgiasu',{
                url: '/student/contact?giasuId',
                templateUrl: '/giasu/contactTutor.html',
                controller: 'tutorController',
                caseInsensitiveMatch: true
            })
            .state('giasugetcontact',{
                url: '/giasu/contactinfo?contactId',
                templateUrl: '/giasu/contactInfo.html',
                controller: 'tutorController',
                caseInsensitiveMatch: true
            })
            .state('contact-success',{
                url: '/giasu/contact-success',
                templateUrl: '/giasu/contactSuccess.html',
                controller: 'tutorController',
                caseInsensitiveMatch: true
            })
            .state('giasucontactstudent',{
                url: '/giasu/contactstudentinfo?contactId',
                templateUrl: '/giasu/contactStudentDetail.html',
                controller: 'tutorController',
                caseInsensitiveMatch: true
            })
            .state('tutor-class',{
                url: '/giasu/class',
                templateUrl: '/giasu/class/index.html',
                controller: 'TutorProfileController',
                caseInsensitiveMatch: true
            })
            .state('tutor-new-class',{
                url: '/giasu/classnew',
                templateUrl: '/giasu/class/newClass.html',
                controller: 'TutorProfileController',
                // controller: 'CkeditorCtrl',
                caseInsensitiveMatch: true
            })
            .state('tutorclassdetail',{
                url: '/giasu/classdetail?classId',
                templateUrl: '/giasu/class/classDetail.html',
                controller: 'TutorProfileController',
                caseInsensitiveMatch: true
            })
            .state('tutorclassupdate',{
                url: '/giasu/classupdate?classId',
                templateUrl: '/giasu/class/classUpdate.html',
                controller: 'TutorProfileController',
                caseInsensitiveMatch: true
            })
            .state('classdetail',{ // for home page
                url: '/class?classId',
                templateUrl: '/class/classDetail.html',
                controller: 'TutorProfileController',
                caseInsensitiveMatch: true
            })
            .state('editprofile',{
                url: '/giasu/editaccount',
                templateUrl: '/giasu/editAccount.html',
                controller: 'TutorProfileController',
                caseInsensitiveMatch: true
            })
            .state('tutor-announce',{
                url: '/giasu/announce?classId',
                templateUrl: '/giasu/announce/index.html',
                controller: 'TutorProfileController',
                caseInsensitiveMatch: true
            })
            .state('create-announce',{
                url: '/giasu/createannounce?classId',
                templateUrl: '/giasu/announce/newAnnounce.html',
                controller: 'TutorProfileController',
                caseInsensitiveMatch: true
            })
            .state('detail-announce',{
                url: '/giasu/announcedetail?announceId',
                templateUrl: '/giasu/announce/announceDetail.html',
                controller: 'TutorProfileController',
                caseInsensitiveMatch: true
            })
            .state('update-announce',{
                url: '/giasu/announceupdate?announceId',
                templateUrl: '/giasu/announce/announceUpdate.html',
                controller: 'TutorProfileController',
                caseInsensitiveMatch: true
            })
            .state('tutor-thaoluan',{
                url: '/giasu/thaoluan?classId',
                templateUrl: '/giasu/thaoluan/index.html',
                controller: 'TutorProfileController',
                caseInsensitiveMatch: true
            })
            .state('thaoluan-new',{
                url: '/giasu/thaoluan/new?classId',
                templateUrl: '/giasu/thaoluan/newThLuan.html',
                controller: 'TutorProfileController',
                caseInsensitiveMatch: true
            })
            .state('thaoluan-detail',{
                url: '/giasu/thaoluan/detail?thaoluanId',
                templateUrl: '/giasu/thaoluan/detailThLuan.html',
                controller: 'TutorProfileController',
                caseInsensitiveMatch: true
            })
            .state('thaoluan-update',{
                url: '/giasu/thaoluan/update?thaoluanId',
                templateUrl: '/giasu/thaoluan/updateThLuan.html',
                controller: 'TutorProfileController',
                caseInsensitiveMatch: true
            })
            .state('editpersonalinfo',{
                url: '/giasu/editprofile',
                templateUrl: '/giasu/editProfile.html',
                controller: 'TutorProfileController',
                caseInsensitiveMatch: true
            })
            .state('editjob',{
                url: '/giasu/editjob',
                templateUrl: '/giasu/editJob.html',
                controller: 'TutorProfileController',
                caseInsensitiveMatch: true
            })
            .state('uploadavatar',{
                url: '/giasu/uploadavatar',
                templateUrl: '/giasu/avatar.html',
                controller: 'TutorProfileController',
                caseInsensitiveMatch: true
            })
            .state('editProStudent',{
                url: '/student/editprofile',
                templateUrl: '/student/index.html',
                controller: 'StudentController',
                caseInsensitiveMatch: true
            })
            .state('map',{
                url: '/map',
                templateUrl: '/map.html',
                controller: 'StudentController',
                caseInsensitiveMatch: true
            })
            .state('maptutor',{
                url: '/maptutor',
                templateUrl: '/maptutor.html',
                controller: 'tutorController',
                caseInsensitiveMatch: true
            })
            .state('registerStudent',{
                url: '/student/registerStudent?studentUsername?search',
                templateUrl: '/student/registerStudent.html',
                controller: 'StudentController',
                caseInsensitiveMatch: true
            })
            .state('inbox',{
                url: '/inbox/:id',
                templateUrl: '/student/index.html',
                controller: 'StudentController',
                caseInsensitiveMatch: true
            })
            .state('monhoc',{
                url: '/giasu/monhoc',
                templateUrl: '/giasu/monhocYC.html',
                controller: 'tutorController',
                caseInsensitiveMatch: true
            })
            .state('unauth',{
                url: '/unauth',
                templateUrl: 'unauth.html',
                caseInsensitiveMatch: true
            })
            .state('unrole',{
                url: '/unrole',
                templateUrl: 'unrole.html',
                caseInsensitiveMatch: true
            })
            .state('test',{
                url: '/test',
                templateUrl: '/test.html',
                controller: 'tutorController',
                caseInsensitiveMatch: true
            });

            // $locationProvider.html5Mode({ // chuyen url #/ -> /
            //     enabled: true,              // ket hop voi <base href="/"> dau trang index.html
            //     requireBase: false
            // });
    }
]);

