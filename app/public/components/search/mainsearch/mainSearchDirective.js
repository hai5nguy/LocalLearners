localLearnersApp.directive('llMainSearch', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/search/mainsearch/mainSearchTemplate.html',
        controller: function($scope, $rootScope, ClassesService, EVENTS) {
            $scope.search = {
                name: ''
            };

            $rootScope.$on(EVENTS.searchCommencing, function () {
                updateSearchData();
            });

            $rootScope.$on(EVENTS.searchFilterUpdated, function (event, searchText) {
                $scope.search.name = searchText;
            });

            function updateSearchData() {
                
                UpcomingClassesService.getClasses().then(function (upcomingClasses) {
                
                    var trimmedUpcomingClasses = _.map(upcomingClasses, function (u) {
                        return {
                            type: 'Upcoming',
                            id: u.eventId,
                            name: u.name
                        }
                    });
                    
                    $scope.searchData = _.union($scope.searchData, trimmedUpcomingClasses);
                }, function (err) {
                    console.log('mainsearch error getting upcoming classes: ', err);
                });

                RequestedClassesService.getClasses().then(function (requestedClasses) {
                    var trimmedRequestedClasses = _.map(requestedClasses, function (r) {
                        return {
                            type: 'Requested',
                            name: r.name,
                            id: r._id
                        }
                    });

                    $scope.searchData = _.union($scope.searchData, trimmedRequestedClasses);

                    //$scope.searchData = searchData;
                }, function (err) {
                    console.log('mainsearch error getting requested classes: ', err);
                });
                
            }
        }
    }
});
