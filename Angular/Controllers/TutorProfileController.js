main.controller("TutorProfileController",function($scope, $http, $rootScope, $filter,  
	$location, $window, $stateParams, $timeout, TutorServices, dateFilter){

	$scope.daytai = ['Tại nhà gia sư', 'Tại nhà học sinh', 'Khác'];
	$scope.filteredPage = []; //slice item for find student
    $scope.mailStudent = [];//slice item for mail box of student
    $scope.sentMail = []; //slice item for page sent mail
    $scope.itemsPerPage = 4;
    $scope.currentPage = 1;
    $scope.studentf = [];
    $scope.mailboxf = []; //total-items for mail
    $scope.sentmail = [];// total-items sent mail
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
	$scope.listMon = function(){
		$http.get('/auth/btutor',$scope.monhoc)
		.then(function(res){
			$scope.monhoc = res.data;
		})
	};

	$scope.dashbroadTutorInfo = function(){
		// find tutor by username - current_user
		$scope.username = $rootScope.current_user;
		$scope.tutor = tutorFactory.getTutorByUsername($scope.username)
		.then(function(response){
			if(response.data){
				$scope.tutor = response.data.giasu;
				// display ngaysinh with format dd/MM/yyyy
				var ngsinh = response.data.giasu.ngaysinh;
				$scope.tutor.ngaysinh = new Date(ngsinh);
				$scope.existDay = function(item){
					return tutorFactory.exists($scope.tutor.noiday, item);
				}
				$scope.selNoiDay = function(item){
					tutorFactory.insertItem($scope.tutor.noiday, item);
				}
				// them mon hoc
				$scope.existMon = function(item){
					return tutorFactory.exists($scope.tutor.daymon, item);
				}
				$scope.selDayMon = function(item){
					tutorFactory.insertItem($scope.tutor.daymon, item);
				}
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

	// update account
	$scope.updateAcc = function(){
		$http.post('/giasu/updateacc', $scope.user)
		.then(function(response){
			if(response.data.success){
				$window.alert(response.data.message);
				$location.path('/giasu');
			} else {
				$scope.message = response.data.message;
			}
		});
	}

	//update profile
	$scope.updateProfile = function(){
		$http.post('/giasu/updateprofile', $scope.tutor)
		.then(function(response){
			if(response.data.success){
				$window.alert(response.data.message);
				$location.path('/giasu');
			} else {
				$scope.message = response.data.message;
			}
		});
	}

	// upload avatar
	$scope.uploadAvatar = function(){
		$scope.uploading = true;
		tutorFactory.upload($scope.user)
		.then(function(data){
			// console.log(data);
			if(data.data.success){
				$scope.uploading = false;
				$scope.alert = 'alert alert-success';
				$scope.message = data.data.message;
				$scope.user = {};
			} else {
				$scope.uploading = false;
				$scope.alert = 'alert alert-danger';
				$scope.message = data.data.message;
				$scope.user = {};
			}
		})
	}

	// hien thi preview cua anh duoc upload
	$scope.photoChange = function(files){
		if(files.length>0 && files[0].name.match(/\.(png|jpg|jpeg)$/)){
			$scope.uploading = true;
			var file = files[0];
			var fileReader = new FileReader();
			fileReader.readAsDataURL(file);
			fileReader.onload = function(e){
				$timeout(function(){
					$scope.thumbnail = {};
					$scope.thumbnail.dataUrl = e.target.result;
					$scope.uploading = false;
					$scope.message = false;
				})
			}
		} else {
			$scope.thumbnail = {};
			$scope.message = false;
		}
	}
		//update job
	$scope.updateJob  = function(){
		$http.post('/giasu/updatejob', $scope.tutor)
		.then(function(response){
			if(response.data.success){
				// console.log(response);
				$window.alert(response.data.message);
				$location.path('/giasu');
			} else {
				$scope.message = response.data.message;
			}
		})
	}

	$scope.thu = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
	$scope.tkb = [{id:1},{id:2}];
	// them select option de nhap thoi khoa bieu
	$scope.addTkb = function(){
		var newItemNo = $scope.tkb.length+1;
		$scope.tkb.push({'id':newItemNo});
	};
	// xoa select option de nhap thoi khoa bieu
	$scope.removeTkb = function(){
		var lastItem = $scope.tkb.length-1;
		$scope.tkb.splice(lastItem);
	}
	// mo lop
	$scope.addClass = function(){
		$scope.reqData = {
			tutor: $scope.tutor,
			tkb: $scope.tkb
		};
		$http.post('/giasu/addclass', $scope.reqData)
		.then(function(response){
			if(response.data.success){
				$window.alert("Mở Lớp Học Mới Thành Công");
				$location.path('/giasu/class');
			} else {
				$scope.alert = "alert alert-danger";
				$scope.message = response.data.message;
			}	
		})
	}
	// liet ke danh sach lop theo giasuId
	$scope.listClass = function(){
		tutorFactory.getTutorByUsername($rootScope.current_user)
		.then(function(response){
			// console.log(response);
			var giasuId = response.data.giasu._id;
			$http.get('/giasu/classlist/'+giasuId)
			.then(function(resp){
				if(resp.data.success){
					$scope.lop = resp.data.lop;
					if($scope.lop.length === 0){
						$scope.message = "Chưa tìm thấy lớp";
					}
					var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
	                var end = begin + $scope.itemsPerPage;
	                $scope.filteredPage = $scope.lop.slice(begin, end);
				}
				$scope.message = resp.data.message;
			})
		})
	}
	// hien thi thong tin chi tiet cua lop cho trang tutor dashbroad
	$scope.classInfo = function(){
		$http.get('/giasu/classdetail/'+$stateParams.classId)
		.then(function(response){
			if(response.data.success){
				// console.log(response.data);
				$scope.lop = response.data.other;
				// console.log($scope.lop);	
				var khaigiang = response.data.other.start;
				$scope.lop.start = new Date(khaigiang);	
				var hanchot = response.data.other.deadline;		
				$scope.lop.deadline = new Date(hanchot);
				// if lop co hoc sinh
				if($scope.lop.hocsinh.length>0){
					$scope.hocsinh = [];
					$scope.lop.hocsinh.forEach(function(currVal, index){
						$http.get('/student/findstudentbyid/'+currVal.hs_id)
						.then(function(resp){
							$scope.hocsinh.push(resp.data.student);						
						})
					});
				}
				// thong tin gia su
				$scope.giasu = response.data.giasu;
				// hien thi avatar
				$scope.avatar = response.data.user.avatar;
				// lay danh gia
				$scope.danhgia = response.data.rating;
				$scope.hsno = response.data.hsno;
			} else {
				$scope.message = response.data.message;
			}			
		})
	}
	// cap nhat thong tin chi tiet cua lop
	$scope.clasUpdate = function(){
		$http.post('/giasu/classupdate/'+$stateParams.classId, $scope.lop)
		.then(function(response){
			// console.log(response);
			$scope.message = response.data.message;
			if(response.data.success){
				$window.alert($scope.message);
				$location.path('/giasu/class');
			} else {
				$scope.alert = "alert alert-danger";				
			}		
		})
	}
	// xoa lop
	$scope.deleteClass = function(classId){
		$http.get('/giasu/deleteclass/'+classId)
		.then(function(response){
			if(response.data.success){
				$window.alert("Xóa Thành Công");
				window.location.reload();
			} else {
				$window.alert("Không thể xóa");
			}	
		})
	}
	// xoa hoc sinh da dang ky lop
	$scope.unregisterClass = function(lopId, studentId){
		$http.get('/giasu/unregisterclass/'+lopId+'/'+studentId)
		.then(function(response){
			if(response.data.success){
				$window.alert("Xóa Thành Công");
				window.location.reload();
			} else {
				$window.alert("Không thể xóa");
			}	
		})
	}
	// bao cao hoc sinh vi pham
	$scope.baoViPham = function(lopId, giasuId, studentId){
		$http.get('/giasu/baocaovipham/'+lopId+'/'+giasuId+'/'+studentId)
		.then(function(response){
			if(response.data.success){
				$window.alert("Cảm ơn bạn");
				window.location.reload();
			} else {
				$window.alert("Không thể báo cáo vi phạm");
			}	
		})
	}
	// list all class in db cho trang home
	$scope.listAllClass = function(){
		$http.get('/listallclass', $scope.lop)
		.then(function(resp){
			if(resp.data.success){
				$scope.lop = resp.data.lop;
				$scope.pag = [];
				$scope.lop.forEach(function(current, index){
					$scope.pag.push(current);
				});
				var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
                var end = begin + $scope.itemsPerPage;
                $scope.filteredPage = $scope.pag.slice(begin, end);
			} else {
				$scope.message = resp.data.message;
			}
		})
	}
	// display class detail o trang home
	$scope.classDetail = function(){
		$http.get('/giasu/classdetail/'+$stateParams.classId)
		.then(function(response){
			if(response.data.success){
				$scope.lop = response.data.lop;
				var giasuId = response.data.lop.giasu;
				// get tutor info
				tutorFactory.getTutorById(giasuId)
				.then(function(resp){
					if(resp.data.success){
						$scope.giasu = resp.data.giasu;
						var username = $scope.giasu.username;
						tutorFactory.getUserByUsername(username)
						.then(function(res){
							$scope.user = res.data.user;
						})
					} else {
						$scope.message = resp.data.message;
					}
				});
			} else {
				$scope.message = response.data.message;
			}
		})
	}
	// signup lop hoc
	$scope.signupClass = function(classId){
		if(!$rootScope.authenticated){
            $location.path('/unauth');
        } else {
        	$http.get('/giasu/singupclass/'+classId+'/'+$rootScope.current_user)
        	.then(function(response){
        		if(response.data.success){
        			$scope.alert = 'alert alert-success';
        			$scope.message = response.data.message;
        			$timeout(function(){
        				$location.path('/');
        			}, 2000);        			
        		} else {
        			$scope.message = response.data.message;
        			$scope.alert = 'alert alert-danger';
        		}
        	})
        }
	}
	// tao thong bao moi
	$scope.adAnnounce = function(){
		var classId = $stateParams.classId;
		$http.post('/giasu/createannounce/'+classId, $scope.tutor)
		.then(function(response){
			if(response.data.success){
				$scope.alert = 'alert alert-success';
				$scope.message = response.data.message;
				$timeout(function(){
					$location.path('/giasu/announce?classId');
				}, 2000);        			
			} else {
				$scope.message = response.data.message;
				$scope.alert = 'alert alert-danger';
			}
		})
	}
	$scope.getClassId = function(){
		$scope.param = $stateParams.classId;
	}
	// list announce of class
	$scope.listAnnounce = function(){
		var classId = $stateParams.classId;
		$http.get('/giasu/listannounce/'+classId)
		.then(function(response){
			if(response.data.success){
				$scope.thongbao = response.data.thongbao;
			} else {
				$scope.message = response.data.message;
			}
		})
	}
	// thong bao detail
	$scope.announceDetail = function(){
		var announceId = $stateParams.announceId;
		$http.get('/giasu/announcedetail/'+announceId)
		.then(function(response){
			if(response.data.success){
				$scope.thongbao = response.data.thongbao;				
				if($scope.thongbao.comment.length>0){
					$scope.comment = $scope.thongbao.comment;
					$scope.user = [];
					$scope.comment.forEach(function(currVal, index){
						tutorFactory.getUserByUsername(currVal.user)
						.then(function(resp){
							$scope.user.push(resp.data.user);
						})
					});
				}
			} else {
				$scope.message = response.data.message;
			}
		});
	}
	//add comment
	$scope.addComment = function(){
		var announceId = $stateParams.announceId;
		// lay avatar tu $rootScope.sess
		var avatar_index = $rootScope.sess.indexOf("avatar") + 9;
		var email_index = $rootScope.sess.indexOf(',"email') - 1;
		var avatar = $rootScope.sess.slice(avatar_index, email_index);

		$scope.reqData = {
			content: $scope.content,
			user: $scope.current_user,
			avatar: avatar
		};
		
		$http.post('/giasu/addcomment/'+announceId, $scope.reqData)
		.then(function(response){
			window.location.reload();
		});
	}
	// cap nhat thong bao
	$scope.announceUpdate = function(){
		$http.post('/giasu/announceupdate/'+$stateParams.announceId, $scope.thongbao)
		.then(function(response){
			// console.log(response);
			$scope.message = response.data.message;
			if(response.data.success){
				// $window.alert($scope.message);
				$scope.alert = "alert alert-success";
				// $location.path('/giasu/class');
			} else {
				$scope.alert = "alert alert-danger";				
			}		
		})
	}
	// xoa thongbao
	$scope.deleteAnnounce = function(announceId){
		$http.get('/giasu/deleteannounce/'+announceId)
		.then(function(response){
			if(response.data.success){
				$window.alert("Xóa Thành Công");
				window.location.reload();
			} else {
				$window.alert("Không thể xóa");
			}	
		})
	}

	$scope.listThaoLuan = function() {
		var classId = $stateParams.classId;
		$http.get('/giasu/listthaoluan/'+classId)
		.then(function(response){
			if(response.data.success){
				$scope.thaoluan = response.data.thaoluan;
			} else {
				$scope.message = response.data.message;
			}
		})
	}

	// them thao luan moi
	$scope.addThaoLuan = function() {
		var author = $rootScope.current_user;
		var classId = $stateParams.classId;
		$http.post('/giasu/addthaoluan/'+classId+'/'+author, $scope.tutor)
		.then(function(response){
			if(response.data.success){
				// $window.alert("Mở Lớp Học Mới Thành Công");
				$location.path('/giasu/thaoluan');
			} else {
				$scope.alert = "alert alert-danger";
				$scope.message = response.data.message;
			}	
		})
	}
	// xem chi tiet thaoluan
	$scope.thaoluanDetail = function() {
		$http.get('/giasu/thaoluandetail/'+$stateParams.thaoluanId)
		.then(function(response){
			if(response.data.success){
				// kiem tra respondent co phai la current_user
				$scope.thaoluan = response.data.thaoluan;
			} else {
				$scope.message = response.data.message;
			}
		})
	}
	// update thaoluan
	$scope.updateThaoLuan = function(){
		$http.post('/giasu/thaoluanupdate/'+$stateParams.thaoluanId, $scope.thaoluan)
		.then(function(response){
			// console.log(response);
			$scope.message = response.data.message;
			if(response.data.success){
				// $window.alert($scope.message);
				$scope.alert = "alert alert-success";
				// $location.path('/giasu/class');
			} else {
				$scope.alert = "alert alert-danger";				
			}		
		})
	}
	// xoa thaoluan
	$scope.deleteThaoLuan = function(thaoluanId){
		$http.get('/giasu/deletethaoluan/'+thaoluanId)
		.then(function(response){
			if(response.data.success){
				$window.alert("Xóa Thành Công");
				$location.path('/giasu/lophoc');
			} else {
				$window.alert("Đã có người trả lời. Không thể xóa");
			}	
		})
	}
	// tra loi thaoluan
	$scope.addResponse = function(){
		var thaoluanId = $stateParams.thaoluanId;
		// lay avatar tu $rootScope.sess
		var avatar_index = $rootScope.sess.indexOf("avatar") + 9;
		var email_index = $rootScope.sess.indexOf(',"email') - 1;
		var avatar = $rootScope.sess.slice(avatar_index, email_index);
		$scope.reqData = {
			respondent: $scope.current_user,
			avatar: avatar,
			answer: $scope.answer
		};
		$http.post('/giasu/addresponse/'+thaoluanId, $scope.reqData)
		.then(function(response){
			window.location.reload();
		})
	}
})