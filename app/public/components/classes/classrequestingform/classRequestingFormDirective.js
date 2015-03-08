localLearnersApp.directive('llClassRequestingForm', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'components/classes/classrequestingform/classRequestingFormTemplate.html',
        controller: function($scope, ClassesService) {
//            $scope.loading = false;
            $scope.newRequest = {};
//
//
            $scope.submit = function() {
//                //todo: validation
//                $scope.loading = true;
//
                var requestedClassToPost = {
                    name: $scope.newRequest.name,
                    categoryName: $scope.newRequest.category.name
                };
//
                console.log('requestedClassToPost ', requestedClassToPost);
//
                ClassesService.postRequestedClass(requestedClassToPost).then(function (response) {
//                    $scope.loading = false;
                    $scope.message = response.data;
                }, function (error) {
//                    $scope.loading = false;
                    $scope.message = error;
                });
            };
//
            ClassesService.getCategories().then(function (categories) {
                categories.unshift({ name: '(Select a category)', value: '' });
                $scope.categories = categories;
                $scope.newRequest.category = $scope.categories[0];
            }, function () {
                $scope.categories = [ { name: 'Error loading categories', value: '' }];
            });

        }
    }
});