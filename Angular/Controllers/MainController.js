//main controller
main.controller("MainController", function ($scope, $http, $location) {

	//save contact
    $scope.sendContact = function(){
        $http.post('/admin/sendContact', $scope.contact)
        .then(function(response){
            // if success
            if(response.data){
                UIkit.modal.alert("Thank your contact")
                .then(function(){
                $location.path('/contact');
                window.location.reload();
            });
            }

        }, function(error){
            // if an error
            console.error(error);
        });
    }

});
