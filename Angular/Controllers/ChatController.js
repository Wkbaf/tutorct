//chat controller
main.controller("ChatController", function ($scope, $http, $rootScope, $location, $stateParams, $firebase) {

        var ref = new Firebase("https://bapchat-14f05.firebaseio.com");
        var searchPara = $location.search();
        $scope.count = 0;
        $scope.ff = false;


        $scope.loadChat = function()
        {
            //Kết nối tới service của firebase, url ở đây là url app của bạn ở bước trên nhé
            //  if($rootScope.current_user)
            // {
            //     if($rootScope.current_role=='student')
            //     {
            //         $scope.name = $rootScope.current_user;
            //         $scope.tutorUsername = searchPara.tutorUsername;
            //     }
            //     if($rootScope.current_role=='giasu')
            //     {
            //         $scope.name = searchPara.tutorUsername;
            //         $scope.tutorUsername = $rootScope.current_user;
            //     }
            // }

            // $scope.chatMessages = $firebase(ref.child($scope.name+'-'+$scope.tutorUsername).limitToLast(8)).$asArray();
                $scope.count=9;
                $scope.ff = true;
        }


        $scope.sendChat = function() {
            var studentname = $scope.name;
            var message = $scope.chatMes;
            var chatname = $rootScope.current_user;
            var tutorname = $scope.tutorUsername;
            var chatMessage = ref.child(studentname+'-'+tutorname);
            chatMessage.push({
                    name: chatname,
                    message: message
              });
            $scope.chatMessages.$add(chatMessage);
            $scope.chatMes = "";
        }

});