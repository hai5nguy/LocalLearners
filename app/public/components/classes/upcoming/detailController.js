localLearnersApp.controller('Upcoming.DetailController', function($scope, $rootScope, EVENTS, $stateParams, ClassesService, UpcomingClassesService, CurrentUser, $state) {
    populateClass();
    
    function populateClass() {

        console.log('222 ', $stateParams.id);
        UpcomingClassesService.getClass($stateParams.id).then(function (upcomingClass) {
            
            console.log('111 ', upcomingClass);
            $scope.upcomingClass = upcomingClass;
            
        });
        
    }
});
