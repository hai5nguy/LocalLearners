localLearnersApp.directive('llMainSearch', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/search/mainsearch/mainSearchTemplate.html',
        controller: function($scope, $rootScope, ClassesService, EVENTS) {
            $scope.search = {
                name: ''
            };

            $rootScope.$on(EVENTS.searchFilterUpdated, function(event, searchText) {
                $scope.search.name = searchText;
            });

            ClassesService.getUpcomingClasses().then(function(upcomingClasses) {
                $scope.upcomingClasses = upcomingClasses;
            }, function (err) {
                console.log('mainsearchtempate error: ', err);
            });
        }
    }
});
