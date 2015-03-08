localLearnersApp.directive('llClassCreationForm', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'components/classes/classcreationform/classCreationFormTemplate.html',
        controller: function($scope, $rootScope, ClassesService, EVENTS) {
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

                ClassesService.postClass(classToPost).then(function (response) {
                    $scope.loading = false;
                    $scope.message = response.data;
                }, function (error) {
                    $scope.loading = false;
                    $scope.message = error;
                });
            };

            ClassesService.getCategories().then(function (categories) {
                console.log('in creation');
                categories.unshift({ name: '(Select a category)', value: '' });
                $scope.categories = categories;
                $scope.newClass.category = $scope.categories[0];
            }, function () {
                $scope.categories = [ { name: 'Error loading categories', value: '' }];
            });
            
            $scope.$watch('newClass.name', function (newName, oldName) {
                $rootScope.$emit(EVENTS.topRequestedClassesFilter, newName);
            });

        }
    }
});