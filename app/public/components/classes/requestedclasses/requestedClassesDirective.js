localLearnersApp.directive('llRequestedClasses', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/classes/requestedclasses/requestedClassesTemplate.html',
        controller: function($scope, $rootScope, ClassesService) {
//            ClassesService.getCategories()
//                .then(
//                function (cats) {
//                    cats.unshift({ name: 'All Categories', value: '' });
//                    $scope.categories = cats;
//                    $scope.selectedCategory = $scope.categories[0];
//                },
//                function () {
//                    $scope.categories = [{ name: 'Error loading categories', value: '' }];
//                }
//            );
//
//            ClassesService.getUpcomingClasses(function(upcomingClasses) {
////                console.log('upcoming', upcomingClasses);
//                $scope.availClasses = upcomingClasses;
//            });

            console.log('underscore ', _);

            ClassesService.getRequestedClasses().then(function(requestedClasses) {
                $scope.requestedClasses = requestedClasses;
            }, function (err) {
                //todo: handle errors
                console.log('requestedclassesdirective error');
            });

        }
    }
});