localLearnersApp.controller('Requested.DetailController', function($scope, $rootScope, EVENTS, $stateParams, ClassesService, RequestedClassesService, CurrentUser, $state) {
    
    $rootScope.$on(EVENTS.authUserLoggedIn, function() {
        $scope.action = determineAction(); 
    });
    
    ClassesService.getRequestedClass($stateParams.id).then(function (requestedClass) {
        //console.log('getrequestedclass', requestedClass);
        updateView(requestedClass);
    });
    
    $scope.setInterested = function (interested) {
        var setInterested = RequestedClassesService.setUserInterested($scope.requestedClass._id, interested);
        setInterested.then(function(requestedClass) {
            updateView(requestedClass);
        });
    };
    
    $scope.teach = function(requestedClassId) {
        
        //pass state params
        
        var classDetails = { 
            name: $scope.requestedClass.name,
            category: $scope.requestedClass.category
        };
        
        $state.go('teach', { classDetails: classDetails } );
        
    };
    
    function updateView(requestedClass) {
        $scope.requestedClass = requestedClass;
        $scope.action = determineAction();
    }
    
    function determineAction() {
        var isUserLoggedIn = !!CurrentUser._id;
        if (!isUserLoggedIn) return 'login';

        var userIsAlreadyInterested = _.some($scope.requestedClass.interestedUsers, function (user) {
            return (user._id === CurrentUser._id)
        });
        return (userIsAlreadyInterested ? 'removeInterested' : 'addInterested')
    }
    
});
