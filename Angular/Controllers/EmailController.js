main.controller("EmailController", function($stateParams, TutorServices){
	console.log($stateParams);
	tutorFactory.activeAccount($stateParams.username).then(function(data){
		console.log(data);
	})
})
// for forgot password form
.controller("passwordCtrl", function($scope, $http, $timeout, $location){
	$scope.sendEmail = function(){
		$scope.user = $http.put('/auth/forgotpwd/'+$scope.email)
		.then(function(response){
			if(response.data.success){
				$scope.alert = "alert alert-success";
				$timeout(function() {
                    $location.path('/login');
                }, 2000);
			} else {
				$scope.alert = "alert alert-danger";				
			}
			$scope.message = response.data.message;
		})
	}	
})
// for reset password form
.controller("resetPwdCtrl", function($stateParams, $scope, $http, $timeout, TutorServices){
	// verify token
	$scope.verifyToken = function(){
		console.log('verifytoken');
		tutorFactory.verifyToken($stateParams.resettoken)
		.then(function(response){
			$scope.success = response.data.success;
			if(!$scope.success){
				$scope.alert = "alert alert-danger";
				$scope.message = response.data.message;
			} else {
				console.log(response);
				// if user === null
				if(!response.data.user){
					$scope.success = false;
					$scope.alert = "alert alert-danger";
					$scope.message = "Bạn đã đổi mật khẩu thành công. Link này không thể sử dụng quá 1 lần.";
				}
				$scope.user = response.data.user;
			}
		})
	}
	// change password
	$scope.resetPassword = function(){
		console.log('resetPassword');
		$scope.user = $http.post('/auth/resetpassword', $scope.user)
		.then(function(response){
			if(response.data.success){
				$scope.result = "alert alert-success";
				$scope.msg = response.data.message;
				$timeout(function() {
                    $location.path('/login');
                }, 2000);
			} else {
				$scope.result = "alert alert-danger";
				$scope.msg = response.data.message;
			}			
		})
	}
})
