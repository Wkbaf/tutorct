//auth controller
main.controller("StudentController", function ($scope, $http, $rootScope, $location, $stateParams, $firebase) {
    // $scope.student = {
    //     mon: []
    // };
    $scope.subject = [];
    $scope.error_message = '';
    $scope.mailbox = true;
     $scope.sentmailflag= false; //flag open sent mail
    $scope.where = ["Tại nhà gia sư", "Tại nhà học sinh ", "Khác"];

    //khu vực khai báo cho pagination
    //khai báo mảng lặp ng-repeat bên vew
    $scope.filteredPage = []; //slice item for find student
    $scope.mailStudent = [];//slice item for mail box of student
    $scope.sentMailStudent = []; //slice item for page sent mail
    $scope.loadfeed = []; //slice item for page home load feedback and for page dashboar student load nhu cau mon hoc

    //khai báo giá trang
    $scope.itemsPerPage = 4; //qui định số item student trang tìm kiếm học sinh theo môn học
    $scope.itemsMailPerpage = 2;//qui định số item mail box of student
    $scope.itemsFeedbackPerPage = 3;//qui định số item feedback của trang feedback and for page dashboarch student
    $scope.currentPage = 1;

    //khai báo mảng chứa tổng giá trị
    $scope.studentf = [];
    $scope.mailboxf = []; //total-items for mail
    $scope.sentmails = [];// total-items sent mail
    $scope.feedbacks = [];// total item feedback

    $scope.loader = true;//flag close -open loader

    //flag search
    $scope.flagSearch = 0;//search all

    //ẩn tab danh sách học sinh
    $scope.dsHS = true;

    //khai báo array lưu mấy mail checked (mailbox student)
    $scope.mailCheckedIndexs=[];
    //khai báo array lưu môn checked
    $scope.monCheckedIndexs=[];

    //connect to firebase
    var ref = new Firebase("https://bapchat-14f05.firebaseio.com");


    //rating function (đánh giá gia sư))
    $scope.rateFunction = function(username, tutorUsername)
    {
    console.log('Rating selected: ' +username);
        UIkit.modal.prompt('Điểm', 'Nhập số điểm đánh giá').then(function(diem)
        {
            console.log('Prompted:', diem);
            if(Number(diem))
            {
                $http.post('/student/rateFunction/'+diem+'/'+username+'/'+tutorUsername)
                .success(function(data)
                {
                    //fail load
                    if(!data.success)
                    {
                        UIkit.modal.alert(data.messagerating);
                    }
                    if(data.success)
                    {
                        UIkit.modal.alert(data.messagerating);
                    }
                })
                .error(function(data)
                {
                    console.log('Error: ' + data);
                });
            } else
            {
                UIkit.modal.alert("Điểm đánh giá không hợp lệ");
            }
        });
    };

    // set id của lớp sau khi click đánh giá lớp
    $scope.rateClassId = function(lopId) {
      $scope.classId = lopId;
    }

    //đánh giá lớp học
    $scope.rateClassFunction = function(username)
    {
        var lopId = $scope.classId;
        $http.post('/student/rateClassFunction/'+lopId+'/'+username, $scope.danhgia)
        .success(function(data)
        {
            //fail load
            if(!data.success)
            {
                UIkit.modal.alert(data.messagerating);
            }
            if(data.success)
            {
                $scope.danhgia = '';
                UIkit.modal.alert(data.messagerating).then(function()
                {
                    window.location.reload();
                });
            }
        })
        .error(function(data)
        {
            console.log('Error: ' + data);
        });
    };

     $scope.getStars = function(rating) {
    // Get the value
    var val = parseFloat(rating);
    // Turn value into number/100
    var size = val/5*100;
    return size + '%';
  }

        //pagination
        // figure student <=> per page
        // filteredPage sau khi da slice, no la cai ma ng-repeat
        //page current: - find student 1, inbox mail 1, sent mail 2
        $scope.figureOutStudentToDisplay = function(total_item, itemsPerPage, pagecurrent)
        {
            var begin = (($scope.currentPage - 1) * itemsPerPage);
            var end = begin + itemsPerPage;
            if(pagecurrent == 1)
            {
                $scope.filteredPage = total_item.slice(begin, end);
            }
            if(pagecurrent == 2)
            {
                $scope.mailStudent = total_item.slice(begin, end);
            }
            if(pagecurrent == 3)
            {
                $scope.sentMailStudent = total_item.slice(begin, end);
            }
            if(pagecurrent == 4)
            {
                $scope.loadfeed = total_item.slice(begin, end);
            }
        };

          // when click page number
          $scope.pageChanged = function(total_item, itemsPerPage, pagecurrent)
          {
            $scope.figureOutStudentToDisplay(total_item, itemsPerPage, pagecurrent);
          };
        //end pagination

    //Load student for find student
    $scope.loadstudent = function()
    {
        //lấy tham sô từ url
        var searchPara = $location.search();
        var subjectSearch = searchPara.subject;
        //for search subject
        if(subjectSearch)
        {
            $http.post('/student/findStudentBySubject/'+subjectSearch)
            .success(function(data)
            {
                //fail load
                if(!data.success)
                {
                    $scope.messageGetStudent = data.messageGetStudent;
                }
                if(data.success)
                {
                    //pagination
                angular.forEach(data.array, function(value, key)
                {
                  $scope.studentf.push(value);
                });

                var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
                var end = begin + $scope.itemsPerPage;
                $scope.filteredPage = $scope.studentf.slice(begin, end);
                }
            })
            .error(function(data)
            {
                console.log('Error: ' + data);
            });
        }
        //search all
        if(!subjectSearch)
        {
            $http.post('/student/loadstudent')
            .success(function(data)
            {
                // $scope.allStudent = data;
                //fail load
                if(!data.success)
                {
                    $scope.messageLoadStudent = data.messageLoadStudent;
                }
                //sucess
                if(data.success)
                {
                    //pagination
                angular.forEach(data.array, function(value, key)
                {
                  $scope.studentf.push(value);
                });

                var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
                var end = begin + $scope.itemsPerPage;
                $scope.filteredPage = $scope.studentf.slice(begin, end);
                }
            })
            .error(function(data)
            {
                console.log('Error: ' + data);
            });
        }

    };

    //Find student by subject //chua the chuyen trang ma co du lieu
    $scope.findStudentBySubject = function(para)
    {
        if(para=='home')
        {
            var subject = $scope.subjectText;
            $location.path('/fstudent').search({subject: subject.tenmon});
        } else
            {
            var subject = $scope.subjectText;
            $location.path('/fstudent').search({subject: subject.tenmon});
            // location.reload();
            window.setTimeout(function () { location.reload(); }, 300);
            // window.location = '/fstudent/?bappp';
            }

    };

    //Load student for map
    $scope.loadStudentMap = function(){
        $http.post('/student/loadstudent')
        .success(function(data) {
            //fail load
            if(!data.success){
                UIkit.modal.alert(data.messageLoadStudent);
            }
            if(data.success){
                $scope.allStudent = data.array;
            }
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

  //Load student and figure
  $scope.init = function() {
    $scope.loadstudent();
  };


   //Load subjects for registry
    $scope.load = function() {
        $http.post('/admin/list')
        .success(function(data) {
            $scope.subject = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
   };

   //load loại môn học
   $scope.loadCategorySubject = function(){
        $http.post('/admin/listCategorySubject')
        .success(function(data) {
            $scope.allCategorySubject = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

    //save a new student
    $scope.regstudent = function()
    {   if( $scope.monCheckedIndexs.length > 0)
{
        $http.post('/student/regstudent',{params: {mon: $scope.monCheckedIndexs, studentInfo: $scope.student}}).then(function(respond)
        {
            // if success
            if(!respond.data.success)
            {
                UIkit.modal.alert(respond.data.messageReg)
                .then(function(){
                    window.location.reload();
                });
            }
            if(respond.data.success)
            {
                $location.path('/registersuccess');
            }
        }, function(error)
        {
            // if an error
            console.error(error);
        });
}
    };

     //get mon hoc ma student chon
    $scope.regSubjectStudent = function(tenmon)
    {
        if ($scope.monCheckedIndexs.indexOf(tenmon) === -1) {
             $scope.monCheckedIndexs.push(tenmon);
         }
         else {
             $scope.monCheckedIndexs.splice($scope.monCheckedIndexs.indexOf(tenmon), 1);
         }
    }

     //Tutor contact to Student
    $scope.contactStudent = function(user){
        $scope.studentUsername = $stateParams.studentUsername;
        var username = user;//tutor username
        $http.post('/student/contactStudent/'+$scope.studentUsername+'/'+username, $scope.mailToStudent).then(function(respond){
            // if success
            if(respond.data.success)
            {
                UIkit.modal.alert(respond.data.messageContact);
                $location.path('/fstudent');
            }
            //if fail
            if(!respond.data.success)
            {
                $location.path('/fstudent');
                UIkit.modal.alert(respond.data.messageContact);
            }

        }, function(error){
            // if an error
            console.error(error);
        });
    };

    //load mail student
    $scope.mailStudent = function(current_user)
    {
        var username = current_user;
        $http.post('/student/mailStudent/'+username).then(function(respond)
        {
            // if success
            // $scope.yourContact = respond.data.array;

            //lặp từng giá trị của respond
            angular.forEach(respond.data.array, function(value, key)
                {
                  $scope.mailboxf.push(value);
                });

                var begin = (($scope.currentPage - 1) * $scope.itemsMailPerpage);
                var end = begin + $scope.itemsMailPerpage;
                $scope.mailStudent = $scope.mailboxf.slice(begin, end);
        }, function(error)
        {
            // if an error
            console.error(error);
        });
    };

    //load sent mail student
    $scope.sentmailStudent = function(current_user)
    {
        $http.post('/student/loadSentMail/'+current_user).then(function(respond)
        {
            // if success
            //lặp từng giá trị của respond
            angular.forEach(respond.data.array, function(value, key)
            {
              $scope.sentmails.push(value);
            });

            var begin = (($scope.currentPage - 1) * $scope.itemsMailPerpage);
            var end = begin + $scope.itemsMailPerpage;
            $scope.sentMailStudent = $scope.sentmails.slice(begin, end);
        }, function(error)
        {
            // if an error
            console.error(error);
        });
    };

    //check user login or not and check role 's user to contact student
    $scope.checkRole = function(){
        var current_user = $rootScope.current_user;
        var current_role = $rootScope.current_role;
        if(current_user!='Guest'){
            if(current_role!='student' && current_role!='admin'){
                return true;
            }
            return false;
        }
        return false;
    };

    //check user login or not and check role 's user return url
    $scope.checkUrl = function(){
        if($rootScope.current_user=='Guest'){
            return 'unauth'
        }else if($rootScope.current_role=='student'){
            return 'unrole'
        }
    };

    //check user invalid url
    $scope.checkInvalidUrl = function(){
        if($rootScope.current_user=='Guest'){
             $location.path('/unauth');
        }else if($rootScope.current_role=='student'){
             $location.path('/unrole');
        }else if($rootScope.current_role=='giasu'){

            var studentUsername = $stateParams.studentUsername;
            var searchType = $stateParams.search;
            $http.post('/student/checkThaytro/'+studentUsername+'/'+$rootScope.current_user).then(function(respond){

            //đã tồn tại mối liên lạc thầy trò
            if(!respond.data.success)
            {
                if(searchType)//search student
                {
                    $location.path('/fstudent');
                }
                if(!searchType)
                {
                    $location.path('/map');
                }
                UIkit.modal.alert(respond.data.messageThaytro).then(function() {
                    // $window.history.back();

                    // window.setTimeout(function () { location.reload(); }, 1000);
                });
            }

            }, function(error){
                // if an error
                console.error(error);
            });
        }
    };

    //check role and user login to contact
    $scope.checkContact = function(studentUsername)
    {
        var current_user = $rootScope.current_user;
        var current_role = $rootScope.current_role;
        if(current_user!='Guest')
        {
            if(current_role!='student' && current_role!='admin')
            {
                //check valid contact
                $http.post('/student/checkInvalidC')
                .then(function(respond)
                {
                    // if success
                    $location.path('/registerStudent');
                }, function(error){
                    // if an error
                    console.error(error);
                });
            }
                else
                {
                    //invalid role
                    $location.path('/unrole');
                }
        }
            else
            {
                //not yet login
                $location.path('/unauth');
            }
    };

    //load infor of student for left menu
    $scope.loadLeftStudent = function(current_user){
        var username = current_user;
        $http.post('/student/loadProfileStudent/'+username).then(function(respond){
            // if success
            $scope.leftProfile = respond.data;
        }, function(error){
            // if an error
            console.error(error);
        });
    }
    //load profile of student
    $scope.loadProfileStudent = function(current_user){
        var username = current_user;
        $http.post('/student/loadProfileStudent/'+username).then(function(respond){
            // if success
            $scope.yourProfile = respond.data;
        }, function(error){
            // if an error
            console.error(error);
        });
    };

    //update profile student
    $scope.updateProfileStudent = function(current_user){
        var username = current_user;
        $http.post('/student/updateProfileStudent/'+username,$scope.yourProfile).then(function(respond){
            // if success
            $location.path('/student');
            window.location.reload();
        }, function(error){
            // if an error
            console.error(error);
        });
    };

    //load account student
    $scope.loadAccountStudent = function(current_user){
        var username = current_user;
        $http.post('/student/loadAccountStudent/'+username).then(function(respond){
            // if success
            $scope.user = respond.data;
        }, function(error){
            // if an error
            console.error(error);
        });
    };

    //update account student
    $scope.updateAccountStudent = function(current_user)
    {
        var username = current_user;
        $http.post('/student/updateAccountStudent/'+username,$scope.user).then(function(respond)
        {
            // if success
            if(!respond.data.success)
            {
                 UIkit.modal.alert(respond.data.messageAccount);
            }
            if(respond.data.success)
            {
                UIkit.modal.alert(respond.data.messageAccount);
                //load page
                $location.path('/student');
                window.location.reload();
            }
        }, function(error)
        {
            // if an error
            console.error(error);
        });
    };

    //location when click view detail mail
    $scope.viewmail = function(id, avatar){
        // $location.path('inbox/' + id);
        $scope.mailbox = false;
        $http.post('/student/viewmail/'+id).then(function(respond){
            // if success
            $scope.yourViewMail = respond.data;
            $scope.mailAvatar = avatar;
        }, function(error){
            // if an error
            console.error(error);
        });
    };

    //accept mail
    $scope.mailAccept = function(mailId)
    {
        $http.post('/student/mailAccept/'+mailId).then(function(respond)
        {
            // if success
            if(respond.data.success)
            {
                UIkit.modal.alert(respond.data.messageAccept)
                .then(function()
                {
                    $location.path('/student');
                    window.location.reload();
                });
            }
            else
            {
                 UIkit.modal.alert(respond.data.messageAccept);
            }
        }, function(error){
            // if an error
            console.error(error);
        });
    };

    //deny mail
    $scope.mailDeny = function(mailId)
    {
        UIkit.modal.prompt('Nhập lý do bạn từ chối', 'Lý do từ chối')
        .then(function(reason)
        {
            // console.log('Prompted:', reason);
            if(reason)
            {
                $http.post('/student/mailDeny/'+mailId+'/'+reason)
                .then(function(respond)
                {
                    // if success
                    $location.path('/student');
                    // $scope.mailbox = true;
                    UIkit.modal.alert(respond.data.messageAccept)
                    .then(function()
                    {
                        window.location.reload();
                    });
                }, function(error)
                {
                // if an error
                console.error(error);
                });
            }
        });
    };

    //load mail tutor accepted
    $scope.tutorAccept = function(current_user){
        $http.post('/student/tutorAccept/'+current_user).then(function(respond){
            // if success
            $scope.tutorAccepted = respond.data.array;
        }, function(error){
            // if an error
            console.error(error);
        });
    };

    //release tutor
    $scope.releaseTutor = function(tutorUsername, current_user)
    {
        UIkit.modal.confirm('Nếu chọn đồng ý, Liên lạc giữa bạn và gia sư: <b>'+tutorUsername+'</b> sẽ bị hủy. Bao gồm cả việc bạn sẽ bị xóa khỏi danh sách các lớp học của gia sư. <br> Bạn có chắc muốn HỦY liên lạc').then(function()
        {
            $http.post('/student/releaseTutor/'+tutorUsername+'/'+current_user).then(function(respond)
            {
            // if success
            if(!respond.data.success)
            {
                UIkit.modal.alert(respond.data.messageRelease);
            }
            if(respond.data.success)
            {
                UIkit.modal.alert(respond.data.messageRelease)
                .then(function()
                {
                    $location.path('/student');
                    window.location.reload();
                });
            }
            }, function(error){
                // if an error
                console.error(error);
            });
        }, function ()
        {
            UIkit.modal.alert('Bạn đã Hủy yêu cầu Xóa liên lạc thành công');
        });
    };

    //view Tutor
    $scope.viewTutor = function(username, avatar){
        $http.post('/student/viewTutor/'+username).then(function(respond){
            // if success
            $scope.tutor = respond.data.tutor;
            $scope.lop = respond.data.lop;
            $scope.tutorAvatar = avatar;
        }, function(error){
            // if an error
            console.error(error);
        });
    };

    //view Student
    $scope.viewStudent = function(arrayHSUsername){
        $scope.arrayHSUsername = arrayHSUsername;
    };

    //feed back subject (save feedback)
    $scope.feedbackSubject = function(current_user,yourSubject){
        $http.post('/student/feedbackSubject/'+current_user+'/'+yourSubject,$scope.feedback).then(function(respond){
            // if success
            UIkit.modal.alert(respond.data.messageFeedback)
            .then(function(){
                $location.path('/student');
                window.location.reload();
            });
        }, function(error){
            // if an error
            console.error(error);
        });
    }

    //load feed back subject (page home)
    $scope.loadFeedbackSubject = function(){
        $http.post('/student/loadFeedbackSubject').then(function(respond)
        {
            // if success
            // $scope.loadfeed = respond.data;
            //lap tren mang tra ve
            angular.forEach(respond.data, function(value, key)
                {
                  $scope.feedbacks.push(value);
                });

                var begin = (($scope.currentPage - 1) * $scope.itemsFeedbackPerPage);
                var end = begin + $scope.itemsFeedbackPerPage;
                $scope.loadfeed = $scope.feedbacks.slice(begin, end);

        }, function(error)
        {
            // if an error
            console.error(error);
        });
    }

    //back to mail box
    $scope.backMailBox = function(){
        $scope.mailbox = true;
    };

    //RELOAD
    $scope.reloadMailbox = function(current_user){
        // alert ("fasdf");
        $scope.mailStudent(current_user).load();
        // alert ("fasd");
    }

    //delete mail == đổi trạng thái nó lại là 4
    $scope.deleteMailbox = function()
    {
        if($scope.mailCheckedIndexs.length > 0)
        {
            $http.get('/student/deleteMailbox',{params: {name: $scope.mailCheckedIndexs}}).then(function(respond)
            {
            // if success
                if(!respond.data.success)
                {
                    UIkit.modal.alert(respond.data.messagemailStudent);
                }
                if(respond.data.success)
                {
                    UIkit.modal.alert(respond.data.messagemailStudent)
                    .then(function(){
                        $location.path('/student');
                        window.location.reload();
                    });
                }
            }, function(error)
            {
                // if an error
                console.error(error);
            });
        } else
            {
                UIkit.modal.alert("Hãy chọn mail trước khi xóa");
            }
    }

    //checked mail
    $scope.mailChecked = function(mailId)
    {
         if ($scope.mailCheckedIndexs.indexOf(mailId) === -1) {
             $scope.mailCheckedIndexs.push(mailId);
         }
         else {
             $scope.mailCheckedIndexs.splice($scope.mailCheckedIndexs.indexOf(mailId), 1);
         }
    }

    //check all mail
    // $scope.mailCheckedAll = function()
    // {

    //      if ($scope.mailCheckedIndexs.indexOf(mailId) === -1) {
    //          $scope.mailCheckedIndexs.push(mailId);
    //      }
    // }

    //show mail8
    $scope.showmail = function()
    {
        $scope.sentmailflag = true;
    }

    //Load time
    $scope.reloadPageTime = function(time){
        window.location.reload(time);
    }

    //chatbox của gia sư - học sinh
    $scope.loadChat = function(tutorUsername)
    {
         if($rootScope.current_user)
        {
            if($rootScope.current_role=='student')
            {
                $scope.name = $rootScope.current_user;
                $scope.tutorUsername = tutorUsername;
            }
            if($rootScope.current_role=='giasu')
            {
                $scope.name = tutorUsername;
                $scope.tutorUsername = $rootScope.current_user;
            }
        }
        $scope.chatMessages = $firebase(ref.child($scope.name+'-'+$scope.tutorUsername).limitToLast(9)).$asArray();
    }

    //chatbox của học sinh - học sinh
    $scope.loadChatHS = function(studentUsername)
    {
         if($rootScope.current_user)
        {
            if($rootScope.current_role=='student')
            {
                $scope.name = $rootScope.current_user;
                $scope.tutorUsername = tutorUsername;
            }
            if($rootScope.current_role=='giasu')
            {
                $scope.name = tutorUsername;
                $scope.tutorUsername = $rootScope.current_user;
            }
        }
        $scope.chatMessages = $firebase(ref.child($scope.name+'-'+$scope.tutorUsername).limitToLast(9)).$asArray();
    }

    $scope.sendChat = function()
    {
        var studentname = $scope.name;
        var message = $scope.chatMes;
        var chatname = $rootScope.current_user;
        var tutorname = $scope.tutorUsername;
        var chatMessage = ref.child(studentname+'-'+tutorname);
        chatMessage.push
        ({
                name: chatname,
                message: message,
                createdAt: Firebase.ServerValue.TIMESTAMP
        });
        // $scope.chatMessages.$add(chatMessage);
        $scope.chatMes = "";
    }

    //delay loader
    $scope.timeloader = function() {
         window.setTimeout(function () { $scope.loader = false; }, 5000);
    }

    //load danh sach lop hoc da dang ki, load cac thong bao
    $scope.listClass = function(studentUsername)
    {
        $http.post('/student/listClass/'+studentUsername).then(function(respond)
        {
            // if success
            if(respond.data.success)
            {
                $scope.listClassOfStudent = respond.data.listClass;
            }
        }, function(error){
            // if an error
            console.error(error);
        });
    }

    //load class feed back (dashboard)
    $scope.listFeed = function(studentUsername)
    {
        $http.post('/student/listFeed/'+studentUsername).then(function(respond)
        {
            // if success
            if(respond.data.success)
            {
                // $scope.listFeedOfStudent = respond.data.listFeed;
                angular.forEach(respond.data.listFeed, function(value, key)
                {
                  $scope.feedbacks.push(value);
                });

                var begin = (($scope.currentPage - 1) * $scope.itemsFeedbackPerPage);
                var end = begin + $scope.itemsFeedbackPerPage;
                $scope.loadfeed = $scope.feedbacks.slice(begin, end);
            }
        }, function(error){
            // if an error
            console.error(error);
        });
    }

    //delete Feed
    $scope.deleteFeed = function(feedId, feedSubject, index, currentPage)
    {
        UIkit.modal.confirm('Bạn chắc chắn muốn xóa nhu cầu môn:'+feedSubject).then(function()
        {
            $http.post('/student/deleteFeed/'+feedId+'/'+feedSubject).then(function(respond)
            {
                // if success
                if(respond.data.success)
                {
                    UIkit.modal.alert(respond.data.messageRemoveFeed);
                    // $scope.loadfeed.refresh();
                    //feed có vi tri là index trong mang slice
                    $scope.loadfeed.splice(index,1);
                    //feed co vi tri la ?? trong mang tong
                    var indexInTotal = (($scope.currentPage - 1) * $scope.itemsFeedbackPerPage);
                    $scope.feedbacks.splice((indexInTotal + index),1);
                }
            }, function(error){
                // if an error
                console.error(error);
            });
        });
    }

    //view class
    $scope.viewClass = function(lop)
    {
        // alert ("adsa"+JSON.stringify(lop.giasu));
        $scope.classView = lop;
    }

    //view danh sách học sinh của lớp
    $scope.viewDanhsachHS = function(lop)
    {
        var lopId = lop._id;
        $scope.lophoc = lop;
        $http.post('/student/viewClass/'+lopId).then(function(respond)
        {
            // if success
            //lấy danh sách thông tin của hoc sinh
            if(respond.data.success)
            {
                // hiện tab danh sách học sinh
                $scope.dsHS = false;
                $scope.danhsachHS = respond.data.danhsachHS;
            }
        }, function(error){
            // if an error
            console.error(error);
        });
    }

    //view thong bao
    $scope.viewThongBao = function(lopId)
    {
        $http.post('/student/viewThongBao/'+lopId)
        .then(function(respond)
        {
            $scope.idLop = lopId;
            // biến ẩn hiện giữa thông báo và thảo luận
            $scope.closeThaoluan = true;
            // if success
            if(respond.data.success)
            {
                $scope.thongbaoView = respond.data.classThongBaoArray;
                $scope.thongbaoDon = respond.data.classThongBaoArray[0];
                //KHÔNG hiển thị thông báo không có thông báo
                $scope.noThongbao = '';
            }
            if(!respond.data.success)
            {
                $scope.thongbaoView = '';
                $scope.thongbaoDon = '';
                //hiển thị thông báo không có thông báo
                $scope.noThongbao = respond.data.messageThongbao;
            }
        }, function(error){
            // if an error
            console.error(error);
        });
    }

    //view thao luan
    $scope.viewThaoluan = function(lopId)
    {
        $http.post('/student/viewThaoluan/'+lopId)
        .then(function(respond)
        {
            // biến ẩn hiện giữa thông báo và thảo luận
            $scope.closeThaoluan = false;
            // if success
            if(respond.data.success)
            {
                $scope.thaoluanView = respond.data.thaoLuanArray;
                $scope.thongbaoDon = {comment: respond.data.thaoLuanArray[0].response, id: respond.data.thaoLuanArray[0]._id};
                //KHÔNG hiển thị thông báo không có thông báo
                $scope.noThaoluan = '';
            }
            if(!respond.data.success)
            {
                $scope.thaoluanView = '';
                $scope.thongbaoDon = '';
                //hiển thị thông báo không có thông báo
                $scope.noThaoluan = respond.data.messageThaoluan;
            }
        }, function(error){
            // if an error
            console.error(error);
        });
    }

    //show comment khi click vào thông báo
    $scope.showComment = function(thongbaoDon)
    {
        $scope.thongbaoDon = thongbaoDon;
    }

    //show thảo luận
    $scope.showThaoluan = function(thaoluan)
    {
        $scope.thongbaoDon = {comment: thaoluan.response, id: thaoluan._id};
    }

    //add comment cho thong bao
    $scope.AddComment = function(thongbaoDonId, current_user, current_role, avatar)
    {
        if(thongbaoDonId)
        {
            $http.post('/student/AddComment/'+thongbaoDonId+'/'+current_user+'/'+current_role+'/'+avatar, $scope.content)
            .then(function(respond)
            {
                // if success
                if(respond.data.success)
                {
                    $scope.thongbaoDon.comment.push(respond.data.contentComment);
                    $scope.content = '';
                }
            }, function(error){
                // if an error
                console.error(error);
            });
        } else
        {
            UIkit.modal.alert("Vui lòng chọn thông báo trước khi bình luận");
        }

    }

    //add trả lời cho thảo luận
    $scope.AddThaoluan = function(thaoluanId, current_user, avatar)
    {
        if(thaoluanId)
        {
            $http.post('/student/AddThaoluan/'+thaoluanId+'/'+current_user+'/'+avatar, $scope.traloi)
            .then(function(respond)
            {
                // if success
                if(respond.data.success)
                {
                    $scope.thongbaoDon.comment.push(respond.data.contentThaoluan);
                    $scope.traloi = '';
                }
            }, function(error){
                // if an error
                console.error(error);
            });
        } else
        {
            UIkit.modal.alert("Vui lòng chọn thảo luận trước khi trả lời");
        }
    }

    //cập nhật thông tin môn học
    // $scope.loadSubProfile = function()
    // {

    //     $scope.$apply(function(){
    //          $scope.he = $scope.yourProfile;
    //        });
    // }

});

main.directive("starRating", function ()
{
return {
      restrict: 'EA',
      template:
        '<ul class="star-rating" ng-class="{readonly: readonly}">' +
        '  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
        '    <i class="fa fa-star"></i>' + // or &#9733
        '  </li>' +
        '</ul>',
      scope: {
        ratingValue: '=ngModel',
        max: '=?', // optional (default is 5)
        onRatingSelect: '&?',
        readonly: '=?'
      },
      link: function(scope, element, attributes) {
        if (scope.max == undefined) {
          scope.max = 5;
        }
        function updateStars() {
          scope.stars = [];
          for (var i = 0; i < scope.max; i++) {
            scope.stars.push({
              filled: i < scope.ratingValue
            });
          }
        };
        scope.toggle = function(index) {
          if (scope.readonly == undefined || scope.readonly === false){
            scope.ratingValue = index + 1;
            scope.onRatingSelect({
              rating: index + 1
            });
          }
        };
        scope.$watch('ratingValue', function(oldValue, newValue) {
          if (newValue || newValue === 0) {
            updateStars();
          }
        });
      }
    };
});
main.directive("averageStarRating", function() {
  return {
    restrict : "EA",
    template : "<div class='average-rating-container'>" +
               "  <ul class='rating background' class='readonly'>" +
               "    <li ng-repeat='star in stars' class='star'>" +
               "      <i class='fa fa-star' style='margin-right: 0px !important;'></i>" + //&#9733
               "    </li>" +
               "  </ul>" +
               "  <ul class='rating foreground' class='readonly' style='width:{{filledInStarsContainerWidth}}%'>" +
               "    <li ng-repeat='star in stars' class='star filled'>" +
               "      <i class='fa fa-star' style='margin-right: 0px !important;'></i>" + //&#9733
               "    </li>" +
               "  </ul>" +
               "</div>",
    scope : {
      averageRatingValue : "=ngModel",
      max : "=?", //optional: default is 5
    },
    link : function(scope, element, attributes) {
      if (scope.max == undefined) { scope.max = 5; }
      function updateStars() {
        scope.stars = [];
        for (var i = 0; i < scope.max; i++) {
          scope.stars.push({});
        }
        var starContainerMaxWidth = 100; //%
        scope.filledInStarsContainerWidth = scope.averageRatingValue / scope.max * starContainerMaxWidth;
      };
      scope.$watch("averageRatingValue", function(oldVal, newVal) {
        if (newVal) { updateStars(); }
      });
    }
  };
});