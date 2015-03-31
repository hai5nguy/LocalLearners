localLearnersApp.directive('llTopRequestedClasses', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'components/classes/toprequested/topRequestedClassesTemplate.html',
        controller: function($scope, $rootScope, ClassesService, EVENTS, CategoryService) {

            $scope.search = {
                name: ''
            };

            CategoryService.getAll().then(function (categories) {
                categories.unshift({ name: 'All Categories', value: '' });
                $scope.categories = categories;
                $scope.selectedCategory = $scope.categories[0];
            }, function () {
                $scope.categories = [ { name: 'Error loading categories', value: '' }];
            });

            ClassesService.getRequestedClasses().then(function(requestedClasses) {
                $scope.requestedClasses = requestedClasses;
            }, function (err) {
                console.log('toprequestedclasses error', err);
            });
            
            $rootScope.$on(EVENTS.topRequestedClassesFilter, function (event, filter) {
                $scope.search.name = filter;
            })

        }
    }
});
