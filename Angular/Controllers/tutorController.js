main.controller("tutorController",function($scope, $http, $window, $rootScope,  $timeout,
	$location, $stateParams, $firebase, TutorServices){
	$scope.giasu = {};
	$scope.daytai = ['Tại nhà gia sư', 'Tại nhà học sinh', 'Khác'];
	// gia tri phan trang
	$scope.filteredPage = []; //slice item for find student
    $scope.mailStudent = [];//slice item for mail box of student
    $scope.sentMail = []; //slice item for page sent mail
    $scope.itemsPerPage = 4;
    $scope.currentPage = 1;
    $scope.studentf = [];
    $scope.mailboxf = []; //total-items for mail
    $scope.sentmail = [];// total-items sent mail

	// liet ke mon cho form tim kiem gia su theo mon
	$scope.listMon = function(){
		$http.get('/auth/btutor',$scope.monhoc)
		.then(function(res){
			// respose.data[] -> data[] = monhoc[]
			$scope.monhoc = res.data;
		})
	};

	//pagination
    // figure student <=> per page
    // filteredPage sau khi da slice, no la cai ma ng-repeat
    //page current: - find student 1, inbox mail 1, sent mail 2
    $scope.figureOutStudentToDisplay = function(total_item, pagecurrent)
    {
        var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
        var end = begin + $scope.itemsPerPage;
        if(pagecurrent == 1)
        {
            $scope.filteredPage = total_item.slice(begin, end);
            console.log($scope.filteredPage);
        }
        if(pagecurrent == 2)
        {
            $scope.mailStudent = total_item.slice(begin, end);
        }
        if(pagecurrent == 3)
        {
            $scope.sentMail = total_item.slice(begin, end);
        }
    };

      // when click page number
      $scope.pageChanged = function(total_item, pagecurrent)
      {
        $scope.figureOutStudentToDisplay(total_item, pagecurrent);
      };
    //end pagination

	// tim gia su theo mon hoc
	$scope.findTutorBySubject = function(){
		$http.post('/giasu/findtutorbysubj', $scope.monhoc.tenmon)
		.then(function(response){
			$scope.show = false;
			if(response.data.success){
			//success la res.json luu trong authentication.js
				$scope.giasu = response.data.giasu;
				// if ko tim thay gia su -> thong bao ko tim thay
				if($scope.giasu.length === 0){
					$scope.show = false;
					$scope.message = "Không tìm thấy gia sư";
				} else {
					// $location.path('/ftutorsub');
					console.log(response.data);
					$scope.show = true;
				}
			} else {
				$scope.message = response.data.message;
			}
		})
	}
	//tim gia su theo mon va noi day
	$scope.findTutor = function(){
		$http.post('/giasu/findtutorbyquery', $scope.search)
		.then(function(response){
			console.log(response);
			$scope.show = false;
			if(response.data.success){
			//success la res.json luu trong authentication.js
				$scope.giasu = response.data.giasu;

				// if ko tim thay gia su -> thong bao ko tim thay
				if($scope.giasu.length === 0){
					// $scope.show = false;
					$scope.message = "Không tìm thấy gia sư";
				} else {
					// $location.path('/ftutorsub');
					$scope.show = true;
				}

			} else {
				$scope.message = response.data.message;
			}
		})
	}

	// liet ke all gia su trong he thong
	$scope.listTutor = function(){
		$http.get('/ftutor', $scope.all_giasu)
		.then(function(response){
			if(response.data.success){
				$scope.all_giasu = response.data.giasu;
				$scope.giasu = [];
				// for pagination
				$scope.all_giasu.forEach(function(currVal, index){
					$scope.giasu.push(currVal);
				});
				var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
                var end = begin + $scope.itemsPerPage;
                $scope.filteredPage = $scope.giasu.slice(begin, end);
                // console.log($scope.filteredPage);
			} else {
				$scope.message = "Không tìm thấy gia sư";
			}
		})
	}
	// hien thi thong tin chi tiet 1 giasu bang id
	$scope.infoTutor = function(){
		$scope.giasuId = $stateParams.giasuId;
		$http.get('/giasu/findtutorbyid/'+ $scope.giasuId)
		.then(function(response){
			if(response.data.success){
				if($scope.giasu.length===0){
					$scope.message = "Không tồn tại gia sư này";
				} else {
					$scope.giasu = response.data.giasu;
					$scope.avatar = response.data.user.avatar;
				}
			}
		})
	}
	$scope.findTutorById = function(giasuId){
		$scope.giasuId = giasuId;
		$http.get('/giasu/findtutorbyid/'+ $scope.giasuId)
		.then(function(response){
			console.log(response);
			if(response.data.success){
				if($scope.giasu.length===0){
					$scope.message = "Không tồn tại gia sư này";
				} else {
					$scope.giasu = response.data.giasu;
				}
			}
		})
	}
	// get tutor's info by username
	$scope.getTutorByUsername = function(){
		$scope.username = $rootScope.current_user;
		$scope.tutor = tutorFactory.getTutorByUsername($scope.username)
		.then(function(response){
			if(response.data){
				$scope.tutor = response.data.giasu;
			}
		}, function(response){
			console.log(response);
		});
	}

	// luu lienlac voi giasu
	$scope.getContactTutor = function(){
		$scope.giasuId = $stateParams.giasuId;
		$http.post('/giasu/contacttutor/'+$scope.giasuId, $scope.reqContact)
		.then(function(response){
			console.log(response);
			if(response.data.success){
				$location.path('/giasu/contact-success');
			} else {
				$scope.alert = 'alert alert-danger';
				$scope.message = response.data.message;
			}
		}, function(err){
			console.log(err);
		});
	}

	// display basic info in tutor dashbroad
	$scope.dashbroadTutorInfo = function(){
		// find tutor by username - current_user
		$scope.username = $rootScope.current_user;
		$scope.tutor = tutorFactory.getTutorByUsername($scope.username)
		.then(function(response){
			if(response.data){
				$scope.tutor = response.data.giasu;
				$scope.soHocSinh = $scope.tutor.hocsinh.length;
			}
		}, function(response){
			console.log(response);
		});
		// find user by username
		$scope.user = tutorFactory.getUserByUsername($scope.username)
		.then(function(response){
			if(response.data){
				$scope.user = response.data.user;
				// console.log($scope.user);
			}
		}, function(response){
			console.log(response);
		});
	}

	// get new contact of tutor
	$scope.getNewContact = function(){
		// console.log('getNewContact')
		$scope.tutor = tutorFactory.getTutorByUsername($rootScope.current_user)
		.then(function(response){
			if(response.data){
				$scope.tutor = response.data.giasu;
				// find contact by id
				$scope.reqData = {trangthai : 0}; // phai obj if ko bi loi --> 400
				$scope.contact = tutorFactory.getContactByTutorId($scope.tutor._id, $scope.reqData)
				.then(function(response){
					if(response.data.success){
						$scope.contact = response.data.contact;
						if($scope.contact.length === 0){
							$scope.message = "Không có liên lạc mới";
							console.log('ko tim thay');
						} else {
							$scope.student = new Array();
							$scope.contact.forEach(function(currVal, index){
								result = tutorFactory.getStudentByUsername(currVal.hocsinh.hocsinh_username)
								.then(function(response){
									if(response.data){
										st =  response.data.student;
										$scope.student.push(st);
										$scope.resultArr = $scope.contact.map(function(value, index){
											return {
												contact: value,
												student: $scope.student[index]
											}
										});
										// console.log($scope.resultArr);
									}
								});
							});
						}
					} else {
						$scope.message = "Không có liên lạc mới";
						console.log(response.data.message);
					}
				}, function(response){
					console.log(response);
				});
			}
		});
	}

	// get contact detail
	$scope.getContactDetail = function(){
		var contactId = $stateParams.contactId;
		$http.get('/giasu/findcontactid/'+contactId)
		.then(function(response){
			if(response.data.success){
				$scope.lienlac = response.data.lienlac;
				$scope.hocsinh = $scope.getStudentById($scope.lienlac.hocsinh.hocsinh_id);
				// console.log($scope.hocsinh);
			} else {
				$scope.message = response.data.message;
			}
		});

	}

	// accept teach that student
	$scope.acceptTeach = function(contactId, giasuId, hocsinhId, hocsinh_username){
		$scope.reqData = {
			_id : contactId,
			giasuId: giasuId,
			hocsinhId: hocsinhId,
			hocsinh_username: hocsinh_username
		};
		console.log($scope.reqData);
		$scope.accept = $http.post('/giasu/acceptteach', $scope.reqData)
		.then(function(response){
			$scope.message = response.data.message;
			if(response.data.success){
				$scope.alert = "alert alert-success";
				$timeout(function() {
	                $location.path('/giasu');
	            }, 2000);
			} else {
				$scope.alert = "alert alert-danger";
			}

		});
	}
	// reject to teach that student
	$scope.rejectTeach = function(id){
		$scope.reject = $http.post('/giasu/rejectteach', $scope.contact)
		.then(function(response){
			console.log('reject');
			// $window.alert('từ chối dạy học sinh');
			$location.path('/giasu');
			window.location.reload()		;
		});
	}

	// get list tutor's student
	// lay danh sach nhung hocsinh da la hocsinh cua giasu = trangthai = 1
	$scope.getStudentList = function(){
		console.log('getStudentList');
		$scope.tutor = tutorFactory.getTutorByUsername($rootScope.current_user)
		.then(function(response){
			if(response.data){
				$scope.tutor = response.data.giasu;
				// find contact by id
				$scope.requestData = {trangthai : 1}; // phai obj if ko bi loi --> 400
				$scope.lienlac = tutorFactory.getContactByTutorId($scope.tutor._id, $scope.requestData)
				.then(function(response){
					if(response.data.success){
						$scope.lienlac = response.data.contact;
						if($scope.lienlac.length === 0){
							$scope.notyet = "Chưa có học sinh";
						} else {
							hs = new Array();
							$scope.lienlac.forEach(function(currVal, index){
								result = tutorFactory.getStudentByUsername(currVal.hocsinh.hocsinh_username)
								.then(function(response){
									if(response.data){
										hs.push(response.data.student);
										$scope.result = $scope.lienlac.map(function(value, index){
											return {
												contact: value,
												hocsinh: hs[index]
											}
										});
									}
								});
							});
						}
					} else {
						$scope.message = "Chưa có học sinh";
						console.log(response.data.message);
					}
				}, function(response){
					console.log(response);
				});
			}
		});
	}
	// get student info by id
	$scope.getStudentById = function(studentId){
		$http.get('/student/findstudentbyid/'+studentId)
		.then(function(response){
			$scope.hocsinh = response.data.student;
			return $scope.hocsinh;
		})
	}
	// get student info by id with no pameter
	$scope.getStudentInfoById = function(){
		var studentId = $stateParams.studentId;
		$http.get('/student/findstudentbyid/'+ studentId)
		.then(function(response){
			$scope.hocsinh = response.data.student;
			return $scope.hocsinh;
		})
	}

	// list giasu.hocsinh
	$scope.listStudent = function(){
		$http.get('/giasu/liststudent/'+$rootScope.current_user)
		.then(function(response){
			console.log(response.data.list)		;
			$scope.message = response.data.message;
			if(response.data.success){
				$scope.list = response.data.list;
				// phan trang
				var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
                var end = begin + $scope.itemsPerPage;
                $scope.filteredPage = $scope.list.slice(begin, end);

				if($scope.list.length === 0){
					$scope.message = 'Chưa có học sinh';
				}
			} else {
				$scope.message = response.data.message;
			}
		})
	}
	// bao cao vi pham cho list student
	$scope.baoCaoViPham = function(studentId){
		$http.get('/giasu/studentvipham/'+$rootScope.current_user+'/'+studentId)
		.then(function(response){
			if(response.data.success){
				$window.alert("Cảm ơn bạn");
				window.location.reload();
			} else {
				$window.alert("Không thể báo cáo vi phạm");
			}
		})
	}
	// get accept value in contactStudent
	$scope.getStudentResp = function(){
		var tutorname = $rootScope.current_user;
		$http.get('/giasu/getstudentresp/'+tutorname)
		.then(function(response){
			if(response.data.success){
				$scope.ctStudent = response.data.ctStudent;
				$scope.rArr = [];
				var hs= [];
				$scope.ctStudent.forEach(function(currVal, index){
					tutorFactory.getStudentByUsername(currVal.studentUserName)
					.then(function(resp){
						if(resp.data.success){
							hs.push(resp.data.student);
							$scope.rArr = $scope.ctStudent.map(function(value, index){
								return {
									ctStudent: value,
									hocsinh: hs[index]
								}
							});
						}
					});
				});
			} else {
				$scope.message = response.data.message;
			}
		})
	}
	// xem chi tiet lien lac voi hocsinh ng-click
	$scope.ctStudentDetail = function(contactId){
		$http.get('/giasu/ctstudentdetail/'+contactId)
		.then(function(response){
			if(response.data.success){
				$scope.contact = response.data.contact;
			} else {
				$scope.error = response.data.message;
			}
		})
	}
	// get contact student detail by url:id
	$scope.ctStudentDetailURL = function(){
		var contactId = $stateParams.contactId;
		$http.get('/giasu/ctstudentdetail/'+contactId)
		.then(function(response){
			if(response.data.success){
				$scope.contact = response.data.contact;
				var stUsername = $scope.contact.studentUserName;
				tutorFactory.getStudentByUsername(stUsername)
				.then(function(resp){
					if(resp.data.success){
						$scope.hocsinh = resp.data.student;
					}
				})
			} else {
				$scope.error = response.data.message;
			}
		})
	}

    // thêm môn học yêu cầu
    $scope.monhocYC = function(tutorId){
        $http.post('/giasu/monhocYC/'+tutorId, $scope.monhoc)
        .then(function(response){
            if(response.data.success)
            {
                UIkit.modal.alert(response.data.message);
            }
        })
    }

    //load danh sách loại môn học
    $scope.loadLoaiMon = function(){
        $http.post('/admin/listCategorySubject')
        .success(function(data) {
            $scope.allCategorySubject = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    }

	//chat
 	var ref = new Firebase("https://bapchat-14f05.firebaseio.com");

        //chatbox
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
            $scope.chatMessages = $firebase(ref.child($scope.name+'-'+$scope.tutorUsername).limitToLast(8)).$asArray();
        }

    $scope.sendChat = function() {
        var studentname = $scope.name;
        var message = $scope.chatMes;
        var chatname = $rootScope.current_user;
        var tutorname = $scope.tutorUsername;
        var chatMessage = ref.child(studentname+'-'+tutorname);
        chatMessage.push({
                name: chatname,
                message: message,
                createdAt: Firebase.ServerValue.TIMESTAMP
          });
        // $scope.chatMessages.$add(chatMessage);
        $scope.chatMes = "";
    }


    //test
    $scope.testTable = function(){
    	$scope.options = {
        scrollbarV: false,
        columns: [{
	      name: "Ho Ten",
	      width: 300
	    }, {
	      name: "day mon"
	    }, {
	      name: "gioi tinh"
	    }]
      };

      $scope.data = $http.get('/ftutor', $scope.all_giasu)
		.then(function(response){

			if(response.data.success){
				$scope.data = response.data.giasu;
				console.log($scope.data);
			} else {
				$scope.message = "Không tìm thấy gia sư";
			}
		})

      // $scope.data = $scope.giasu;
    }
})
