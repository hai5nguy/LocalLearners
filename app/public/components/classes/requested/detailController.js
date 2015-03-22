localLearnersApp.controller('Requested.DetailController', function($scope, $stateParams, ClassesService, RequestedClassesService) {
    
    ClassesService.getRequestedClass($stateParams.id).then(function (requestedClass) {
        console.log('getrequestedclass', requestedClass);
        $scope.requestedClass = requestedClass;
    });
    
    $scope.interestedClicked = function() {
        //alert('yo');
        var addUser = RequestedClassesService.addInterestedUser($scope.requestedClass._id);
        addUser.then(function (requestedClass) {
            $scope.requestedClass = requestedClass;
        });
        
    }
    
});
