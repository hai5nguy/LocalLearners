localLearnersApp.directive('llClassRequestingForm', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'components/classes/requested/classrequestingform/classRequestingFormTemplate.html',
        controller: controller
    }

    function controller($scope, RequestedClassesService, CategoryService) {
        $scope.newRequest = {};
        
        $scope.submit = function() {
            //todo: validation

            var requestedClassToPost = {
                name: $scope.newRequest.name,
                category: $scope.newRequest.category._id
            };

            console.log('requestedClassToPost ', requestedClassToPost);

            RequestedClassesService.postClass(requestedClassToPost).then(function (response) {
                $scope.message = response.data;
            }, function (error) {
                $scope.message = error;
            });
        };

        CategoryService.getAll().then(function (categories) {
            categories.unshift({ name: '(Select a category)', value: '' });
            $scope.categories = categories;
            $scope.newRequest.category = $scope.categories[0];
        }, function () {
            $scope.categories = [ { name: 'Error loading categories', value: '' }];
        });

    }
});