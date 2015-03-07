localLearnersApp.directive('llUpcomingClasses', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/classes/upcomingclasses/upcomingClassesTemplate.html',
        controller: function($scope, $rootScope, ClassesService) {
            ClassesService.getCategories()
            .then(
                function (cats) {
                    cats.unshift({ name: 'All Categories', value: '' });
                    $scope.categories = cats;
                    $scope.selectedCategory = $scope.categories[0];
                },
                function () {
                    $scope.categories = [{ name: 'Error loading categories', value: '' }];
                }
            );

            ClassesService.getUpcomingClasses().then(function(upcomingClasses) {
                $scope.availClasses = upcomingClasses;
            });

        }
    }
});
