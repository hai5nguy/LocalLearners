localLearnersApp.directive('llClassCreationForm', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/classes/classcreationform/classCreationFormTemplate.html',
        controller: function($scope, ClassesService) {
            $scope.loading = false;
            $scope.newClass = {};

            $scope.submit = function() {
                //todo: validation
                $scope.loading = true;

                var now = new Date(2015,3,20);
                var classToPost = {
                    name: $scope.newClass.name,
                    categoryName: $scope.newClass.category.name,
                    time: now
                };

//                console.log('classtopost ', classToPost);

                ClassesService.postClass(classToPost).then(function (response) {
                    $scope.loading = false;
                    $scope.message = response.data;
                }, function (error) {
                    $scope.loading = false;
                    $scope.message = error;
                });
            };

            ClassesService.getCategories().then(function (categories) {
                categories.unshift({ name: '(Select a category)', value: '' });
                $scope.categories = categories;
                $scope.newClass.category = $scope.categories[0];
            }, function () {
                $scope.categories = [ { name: 'Error loading categories', value: '' }];
            });

        }
    }
});