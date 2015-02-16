localLearnersApp.directive('llUpcomingClasses', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/classes/upcomingclasses/upcomingClassesTemplate.html',
        controller: function($scope, ClassesService) {
            ClassesService.getCategories(function(categories) {
                $scope.categories = categories;
                $scope.selectedCategory = $scope.categories[0];
            });

            ClassesService.getUpcomingClasses(function(upcomingClasses) {
//                console.log('upcoming', upcomingClasses);
                $scope.availClasses = upcomingClasses;
            });

        }
    }
});