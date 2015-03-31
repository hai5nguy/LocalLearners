localLearnersApp.directive('llMostRequested', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'components/classes/mostrequested/mostRequestedDirective.html',
        controller: function($scope, CategoryService) {

            CategoryService.getAll(function(categories) {
                $scope.categories = categories;
                $scope.selectedCategory = $scope.categories[0];
            });
        }
    }
});