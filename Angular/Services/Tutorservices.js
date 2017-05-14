// var TutorService = angular.module('main', []).
main.factory('TutorServices', function($http){
	tutorFactory = {};

	// verify token for forgot password
	tutorFactory.verifyToken = function(token){
		return $http.get('/auth/verifytoken/'+token);
	}
	// for upload avartar with user._id
	tutorFactory.upload = function(user){
		var fd = new FormData();
		fd.append('myfile', user.avatar);
		fd.append('userid',user._id);
		return $http.post('/auth/upload/', fd, {
			transformRequest: angular.identity,
			headers: {'Content-Type' : undefined}
		});
	}

	// check exist item in array
	tutorFactory.exists = function(arr, item){
		return arr.indexOf(item) > -1;
	}
	// insert item into array
	// if already had -> delete
	tutorFactory.insertItem = function(arr, item){
		var idx = arr.indexOf(item);
	   	if(idx > -1){
	     	arr.splice(idx, 1);
	   	} else {
	     	arr.push(item);
	   	}
	}
	// delete exist item in arr
	tutorFactory.deleteSelect = function(arr, item){
	    var idx = arr.indexOf(item);
	    if(idx > -1){
	      arr.splice(idx, 1);
    	} 
  	}

	//get tutor by id
    tutorFactory.getTutorById = function(id){
    	var giasu = $http.get('/giasu/findtutorbyid/'+ id)
		return giasu;
    }

    //get tutor by username
    tutorFactory.getTutorByUsername = function(username){
    	var giasu = $http.get('/giasu/findtutorbyusername/'+username);
		return giasu;
    }

    // get user by username
    tutorFactory.getUserByUsername = function(username){
    	var user = $http.get('/auth/finduserbyusername/'+username);
		return user;
    }

  	/* get contact by giasuId
		trangthai la trangthai trong lienlac model
		0 - hocsinh lien lac gs, gs chua
		trangthai phai la obj -> reqData = {trangthai:value}
  	*/
  	tutorFactory.getContactByTutorId = function(giasuId, trangthai){
  		var contact = $http.post('/giasu/findcontactbytutor/'+giasuId, trangthai);
  		return contact;
  	}

  	// get student by username
    tutorFactory.getStudentByUsername = function(username){
    	var student = $http.post('/student/findstudentbyusername/'+username);
		return student;
    }
  	
  	tutorFactory.activeAccount = function(username){
		return $http.post('/auth/active/'+username);
	}

	return tutorFactory;
});
// console.log('tutor TutorService');