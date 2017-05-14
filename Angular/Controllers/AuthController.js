main.controller("AuthController",function ($scope, $http, $rootScope, $location, TutorServices){
	$scope.message = "";

	// hien thi radio thay, co
	$scope.thayco = ["Thầy, Cô"];

	$scope.daytai = ['Tại nhà gia sư', 'Tại nhà học sinh', 'Khác'];
	$scope.regGiaSu = {};
	$scope.regGiaSu.noiday = [];
	$scope.regGiaSu.daymon = [];

	// hien thi danh sach mon hoc
	// /auth/btutor router.get of express
	$scope.listMon = function(){
		$http.get('/auth/btutor',$scope.monhoc)
		.then(function(res){
			// respose.data[] -> data[] = monhoc[]
			$scope.monhoc = res.data;
			// console.log(response);
		})
	};

	// them noi day cua gia su
	$scope.existDay = function(item){
		return tutorFactory.exists($scope.regGiaSu.noiday, item);
	}
	$scope.selNoiDay = function(item){
		tutorFactory.insertItem($scope.regGiaSu.noiday, item);
	}

	// them mon hoc
	$scope.existMon = function(item){
		return tutorFactory.exists($scope.regGiaSu.daymon, item);
	}
	$scope.selDayMon = function(item){
		tutorFactory.insertItem($scope.regGiaSu.daymon, item);
	}
	// delete exist item
	$scope.deleteMon = function(item){
		tutorFactory.deleteSelect($scope.regGiaSu.daymon, item);
	}

	// become tutor $scope.regData
	$scope.btutor = function(){
		$http.post('auth/btutor', $scope.regGiaSu)
		.then(function(response){
			// if dang ky thanh cong thi ve trang chu
			if(response.data.success){
			//success la res.json luu trong authentication.js
				$location.path('/registersuccess');
			} else {
				$scope.message = response.data.message;
			}
			console.log(response.data);
		}, function(response){
			console.log(response);
		})
	};

	// gui lai email xac nhan
	$scope.resendEmailActive = function(){
		$scope.user = {};
		$scope.user.username = $rootScope.current_user;
		$http.post('/auth/resendemail', $scope.user)
		.then(function(response){
			console.log(response);
		})
	}

	//login
	$scope.login = function(){
		$http.post('auth/login', $scope.reqUser)
		.then(function(response){
			$scope.message = response.data.message;
			if(response.data.success){
				$rootScope.authenticated = true;
				$rootScope.current_user = response.data.user.username;
                $rootScope.current_role = response.data.user.role;
				$rootScope.sess = response.data.user;

				sessionStorage.setItem('sess',JSON.stringify($rootScope.sess));
				sessionStorage.setItem('current_user', $rootScope.current_user);
				sessionStorage.setItem('current_role', $rootScope.current_role);
				if($rootScope.logUrl === ''){
					$location.path('/'+response.data.user.role);
				} else {
					$location.path($rootScope.logUrl);
				}
				
			} else{
				$scope.error_message = response.data.message;
				$rootScope.sess = null;
			}

		}, function(response){
			$scope.message = response.statusText;
			$rootScope.sess = null;
			console.log(response);
		})
	};

});