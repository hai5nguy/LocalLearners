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
                updateSearchDate();
            });

            $rootScope.$on(EVENTS.searchFilterUpdated, function (event, searchText) {
                $scope.search.name = searchText;
            });

            function updateSearchDate() {
                
                //var searchData = [];
                //
                //ClassesService.getUpcomingClasses().then(function (upcomingClasses) {
                //
                //    var trimmedUpcomingClasses = _.map(upcomingClasses, function (u) {
                //        return {
                //            type: 'upcomingClass',
                //            id: u.eventId, 
                //            name: u.name
                //        }
                //    });
                //    
                //    searchData.push(trimmedUpcomingClasses);
                //    
                //    ClassesService.getRequestedClasses().then(function (requestedClasses) {
                //        var trimmedRequestedClasses = _.map(requestedClasses, function (r) {
                //            return {
                //                type: 'requestedClass',
                //                name: r.name,
                //                id: r._id
                //            }
                //        });
                //        
                //        searchData.push(trimmedRequestedClasses);
                //        
                //        console.log('11 ', searchData);
                //        $scope.searchData = searchData;
                //    }, function (err) {
                //        console.log('mainsearch error getting requested classes: ', err);
                //    });
                //}, function (err) {
                //    console.log('mainsearch error getting upcoming classes: ', err);
                //});
                //


                //var searchData = [];
                
                ClassesService.getUpcomingClasses().then(function (upcomingClasses) {
                
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

                ClassesService.getRequestedClasses().then(function (requestedClasses) {
                    var trimmedRequestedClasses = _.map(requestedClasses, function (r) {
                        return {
                            type: 'Requested',
                            name: r.name,
                            id: r._id
                        }
                    });

                    //searchData.push(trimmedRequestedClasses);

                    //console.log('11 ', searchData);

                    $scope.searchData = _.union($scope.searchData, trimmedRequestedClasses);

                    //$scope.searchData = searchData;
                }, function (err) {
                    console.log('mainsearch error getting requested classes: ', err);
                });
                
            }
        }
    }
});
