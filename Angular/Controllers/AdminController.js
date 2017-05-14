//auth controller
main.controller("AdminController", function ($scope, $http, $rootScope, $location,$stateParams) {
    $scope.subject = {name: '', category: ''};
    $scope.addsubject = {};
    $scope.updateSubject = {};
    $scope.error_message = '';
    $scope.message = "";
    $scope.successTextAlert = "";
    $scope.showSuccessAlert = false;

  //create a new subject
    $scope.addSubject = function(){
        $http.post('/admin/save', $scope.addsubject).then(function(respond){
            // if success
            $location.path('/subject');
            if(respond.data.success)
            {
                alert(respond.data.message);
            }
            // console.log(respond);
        }, function(error){
            // if an error
            console.error(error);
        });
    };

    //edit a  subject
    //load data for update
    $scope.editSubject = function(){
        $scope.subjectId = $stateParams.subjectId;
        $http.post('/admin/editSubject/'+$scope.subjectId).success(function(data) {
         $scope.updateSubject = data;
         // console.log("fasdfa"+$scope.updateSubject);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

    //update data subject
    $scope.changeSubject = function(){
        $scope.subjectId = $stateParams.subjectId;
        $http.post('/admin/changeSubject/'+$scope.subjectId,$scope.updateSubject).success(function(data) {
            $location.path('/subject');
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

    //delete subject
    $scope.removeSubject = function(subjectID, subject)
    {
        deleteSub = confirm('Bạn có muốn xóa môn: '+ subject.tenmon);
        if(deleteSub)
        {
            $http.post('/admin/removeSubject/'+subjectID).success(function(data)
            {
            // if success
                if(data.success)
                {
                    $location.path('/subject');
                    window.location.reload();
                }
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        }
    };

    //get list subject
    $scope.listSubject = function(){
        $http.post('/admin/list')
        .success(function(data) {
            $scope.allSubject = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

    //danh sách loại môn học
    $scope.listCategorySubject = function(){
        $http.post('/admin/listCategorySubject')
        .success(function(data) {
            $scope.allCategorySubject = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

    //thêm loại môn học
    $scope.addCategorySubject = function(){
        $http.post('/admin/addCategorySubject', $scope.addcategory).then(function(respond){
            // if success
            $location.path('/categorySubject');
            if(respond.data.success)
            {
                alert(respond.data.message);
            }
        }, function(error){
            // if an error
            console.error(error);
        });
    };

    //xóa loại môn học
    $scope.removeCategorySubject = function(cateSubjectID, categorySubject)
    {
        deleteCateSub = confirm('Bạn có muốn xóa loại môn học: '+ categorySubject.loaimon);
        if(deleteCateSub)
        {
            $http.post('/admin/removeCategorySubject/'+cateSubjectID).success(function(data)
            {
            // if success
                if(data.success)
                {
                    $location.path('/admin/listCategorySubject');
                    window.location.reload();
                }
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        }
    };

    //cập nhật loại môn học (hiển thị thông tin  loại môn học)
    $scope.editCategorySubject = function()
    {
        $scope.cateId = $stateParams.categorySubId;
        $http.post('/admin/editCategorySubject/'+$scope.cateId).success(function(data)
        {
         $scope.updateCategorySubject = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

    //cập nhật loại môn học
    $scope.changeCategorySubject = function()
    {
        $scope.cateId = $stateParams.categorySubId;
        $http.post('/admin/changeCategorySubject/'+$scope.cateId, $scope.updateCategorySubject).success(function(data)
        {
            $location.path('/categorySubject');
            alert (data.message);
        })
        .error(function(data)
        {
            console.log('Error: ' + data);
        });
    };

    //thêm môn học từ feedback
    $scope.feedAddSub = function(hocsinhUsername){
        $http.post('/admin/feedAddSub/'+hocsinhUsername, $scope.detaiFeedback)
        .success(function(data)
        {

            alert (data.messagefeedAddSub);
        })
        .error(function(data)
        {
            console.log('Error: ' + data);
        });
    };

    //thêm môn học từ yêu cầu của gia sư
    $scope.addMonHocYC = function(giasuUsername){
        $http.post('/admin/addMonHocYC/'+giasuUsername, $scope.detaiMonHocYC)
        .success(function(data)
        {
            if(data.success)
            {
                alert (data.messagefeedAddSub);
            }
        })
        .error(function(data)
        {
            console.log('Error: ' + data);
        });
    };

    //login
    $scope.login = function()
    {

        $http.post('admin/login', $scope.admin)
        .success(function(data)
        {
            // if success
            if(data.current_admin==null)
            {
                $rootScope.auth = true;
                $rootScope.messagelogin = data.messagelogin;
            } else
                {
                    $rootScope.auth = false;//hide login show dashboard
                    $rootScope.sess = data.current_admin;
                    $rootScope.current_admin = data.current_admin;
                    $rootScope.current_mail = data.current_mail;
                    $rootScope.current_role  = data.current_role;
                    sessionStorage.setItem('current_admin', $rootScope.current_admin);
                    sessionStorage.setItem('current_role', $rootScope.current_role);
                    sessionStorage.setItem('current_mail', $rootScope.current_mail);
                    $scope.messagelogin = data.messagelogin;
                }
        })
        .error(function(data)
        {
            console.log('Error: ' + data);
        });
    };

    //register
    $scope.register = function()
    {
        $http.post('admin/register', $scope.admin)
        .success(function(data)
        {
            if(data.success)
            {
                 $location.path('/');
                 alert(data.messageRes).then(function(){
                    window.location.reload();
                 });
            } else
                {
                     alert(data.messageRes);
                }
        })
        .error(function(data)
        {
            console.log('Error: ' + data);
        });
    };

    //load danh sách tài khoản
    $scope.loadAccount = function(){
        $http.post('admin/loadAccount')
        .success(function(data) {
            // if success
            $scope.admins = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

    //Xem thông tin tài khoản
    $scope.viewAccount = function(account){
        $scope.detailAccount = account;
    };

    //Xóa tài khoản
    $scope.removeAccount = function(account)
    {
        deleteAccount = confirm('Bạn chắc chắn muốn xóa tài khoản '+ account.email);
        if(deleteAccount)
        {
            $http.post('/admin/removeAccount/'+account._id)
            .success(function(data) {
                if(data.success)
                {
                    alert(data.message);
                    window.location.reload();
                }
                if(!data.success)
                {
                    alert(data.message);
                }
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        }
    };

    //load contact
    $scope.loadContact = function(){
        $http.post('admin/loadContact')
        .success(function(data) {
            // if success
            $scope.contacts = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

    //view contact
    $scope.viewContact = function(id){
        $http.post('/admin/viewContact/'+id)
        .success(function(data) {
            $scope.detailContact = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

    //load feedback
    $scope.loadFeedback = function(){
        $http.post('admin/loadFeedback')
        .success(function(data) {
            // if success
            $scope.feedbacks = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

    //view feedback
    $scope.viewFeedback = function(feed, usernameST)
    {
        $scope.detaiFeedback = feed;
        $scope.hocsinhUsername = usernameST;
        $scope.listCategorySubject();
    };

    //Xóa feedback
    $scope.removeFeed = function(feed){

        deleteFeed = confirm('Bạn có muốn xóa nhu cầu môn: '+ feed.subject);
        if(deleteFeed)
        {
            $http.post('/admin/removeFeed/'+feed._id)
            .success(function(data) {
                if(data.success)
                {
                    alert(data.message);
                    window.location.reload();
                }
                if(!data.success)
                {
                    alert(data.message);
                }
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        }
    };

    //load môn học yêu cầu của gia sư
    $scope.loadMonhocGS = function(){
        $http.post('admin/loadMonhocGS')
        .success(function(data) {
            // if success
            $scope.loadMonhocGSs = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

    //view môn học yêu cầu
    $scope.viewMonHocYC = function(monhoc, giasuUsername)
    {
        $scope.detaiMonHocYC = monhoc;
        $scope.giasuUsername = giasuUsername;
        $scope.listCategorySubject();
    };

    //Xóa yêu cầu môn học của gia sư
    $scope.removeYC = function(monhoc){

        deleteYC = confirm('Bạn có muốn xóa yêu cầu môn: '+ monhoc.tenmon);
        if(deleteYC)
        {
            $http.post('/admin/removeYC/'+monhoc._id)
            .success(function(data) {
                if(data.success)
                {
                    alert(data.message);
                    window.location.reload();
                }
                if(!data.success)
                {
                    alert(data.message);
                }
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        }
    };

    //load profile of current admin
    $scope.profileAdmin = function(){
        $scope.idAdmin = $rootScope.current_admin;
        $http.post('admin/profile/'+$scope.idAdmin)
        .success(function(data) {
            // if success
            $scope.profile = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

    //edit profile admineditSecurityAdmin
    $scope.editProfileAdmin = function(){
        $http.post('admin/editProfileAdmin/',$scope.profile)
        .success(function(data) {
            // if success
            $location.path('/profile');
            alert ("update ok");
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

    //edit Security admin
    $scope.editSecurityAdmin = function(profileId){
        $http.post('admin/editSecurityAdmin/'+profileId,$scope.profile)
        .success(function(data) {
            // if success
            if(data.success)
            {
                alert (data.messageUpdateSecur);
            } else
            {
                alert (data.messageUpdateSecur);
            }

        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

});