localLearnersApp.directive('llClassCreationForm', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'components/classes/classcreationform/classCreationFormTemplate.html',
        controller: function($scope, $rootScope, ClassesService, EVENTS, $stateParams, $q) {
            $scope.loading = false;
            $scope.newClass = {};

            loadCategories()
                .then(handlePassedInClassDetails);


            hookupSubmit();
            hookupNewClassNameChanged();
            
           
            
            function loadCategories() {
                var defer = $q.defer();
                ClassesService.getCategories().then(function (categories) {
                    categories.unshift({ name: '(Select a category)', value: '' });
                    $scope.categories = categories;
                    $scope.newClass.category = $scope.categories[0];
                    console.log('111 ');
                    defer.resolve();
                }, function () {
                    $scope.categories = [ { name: 'Error loading categories', value: '' }];
                    defer.reject('Error loading categories');
                });
                return defer.promise;
            }
            
            
            function handlePassedInClassDetails() {
                if ($stateParams.classDetails) {
                    $scope.newClass.name = $stateParams.classDetails.name;
                    
                    console.log('222 ', $scope.categories);
                    console.log('333 ', $stateParams.classDetails);

                    $scope.newClass.category = _.findWhere($scope.categories, { value: $stateParams.classDetails.category.value });

                    console.log('444 ', $scope.newClass.category);

                }
            }
            
            function hookupSubmit() {

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
            }
            
            function hookupNewClassNameChanged() {
                $scope.$watch('newClass.name', function (newName, oldName) {
                    $rootScope.$emit(EVENTS.topRequestedClassesFilter, newName);
                });
            }

        }
    }
});