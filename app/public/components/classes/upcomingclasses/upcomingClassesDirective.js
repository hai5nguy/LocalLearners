localLearnersApp.directive('llUpcomingClasses', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/classes/upcomingclasses/upcomingClassesDirective.html',
        controller: function($scope, ClassesService) {


            ClassesService.getCategories(function(categories) {
                console.log('categories', categories);

                categories.unshift('All Categories');


                $scope.categories = categories;
                $scope.selectedCategory = $scope.categories[0];
            });
        }
    }
});