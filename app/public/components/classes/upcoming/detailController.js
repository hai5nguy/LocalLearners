localLearnersApp.controller('Upcoming.DetailController', function($scope, $rootScope, EVENTS, $stateParams, ClassesService, UpcomingClassesService, CurrentUser, $state) {
    populateClass();
    hookupSetRSVP();
    
    $scope.action = 'add_rsvp';
    
    function populateClass() {

        console.log('222 ', $stateParams.id);
        UpcomingClassesService.getClass($stateParams.id).then(function (upcomingClass) {
            
            console.log('111 ', upcomingClass);
            $scope.upcomingClass = upcomingClass;
            
        });
    }
    
    function hookupSetRSVP() {
        $scope.setRSVP = function(isAttending) {
            var setRSVP = UpcomingClassesService.RSVP.set($scope.upcomingClass._id, isAttending);
            setRSVP.then(function (upcomingClass) {
                //updateView(upcomingClass);
                console.log('setrsvp upcomingclass', upcomingClass);
            });
        }
        
        /*
         $scope.setInterested = function (interested) {
         var setInterested = RequestedClassesService.setUserInterested($scope.requestedClass._id, interested);
         setInterested.then(function(requestedClass) {
         updateView(requestedClass);
         });
         };
         */
    }
    
});
