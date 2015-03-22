localLearnersApp.controller('Requested.DetailController', function($scope, $stateParams, ClassesService, RequestedClassesService, CurrentUser) {
    
    ClassesService.getRequestedClass($stateParams.id).then(function (requestedClass) {
        console.log('getrequestedclass', requestedClass);

        updateView(requestedClass);
    });
    
    $scope.interestedClicked = function() {
        //alert('yo');
        var addUser = RequestedClassesService.addInterestedUser($scope.requestedClass._id);
        addUser.then(function (requestedClass) {
            updateView(requestedClass);
        });
        
    }
    
    $scope.setInterested = function (interested) {
        var setInterested = RequestedClassesService.setUserInterested($scope.requestedClass._id, interested);
        setInterested.then(function(requestedClass) {
            updateView(requestedClass);
        });
    };
    
    function updateView(requestedClass) {
        $scope.requestedClass = requestedClass;
        //$scope.userAlreadyInterested = _.some($scope.requestedClass.interestedUsers, function (user) {
        //    return (user._id === CurrentUser._id)
        //});
        //
        console.log('111 ', determineAction());
        $scope.action = determineAction();
        
        
        //$scope.userIsRequester = ($scope.requestedClass.requester._id === CurrentUser._id);
        
    }
    
    function determineAction() {
        var userIsLoggedIn = !!CurrentUser._id;
        if (!userIsLoggedIn) return 'login';

        var userIsAlreadyInterested = _.some($scope.requestedClass.interestedUsers, function (user) {
                return (user._id === CurrentUser._id)
            });
        //var userIsRequester = ($scope.requestedClass.requester._id === CurrentUser._id);
        
        if (userIsAlreadyInterested) {
            return 'removeInterested';
        } else {
            return 'addInterested'
        }
    }
    
});
