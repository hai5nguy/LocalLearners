localLearnersApp.directive('llClassCreationForm', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'components/classes/upcoming/classcreationform/classCreationFormTemplate.html',
        controller: controller
    }

    function controller ($scope, $rootScope, ClassesService, EVENTS, $stateParams, $q) {
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


                $scope.newClass.category = _.findWhere($scope.categories, { value: $stateParams.classDetails.category.value });


            }
        }

        function hookupSubmit() {

            $scope.submit = function() {
                //todo: validation
                $scope.loading = true;
                
                console.log('111 ', $stateParams.classDetails);
                
                console.log('222 ', Boolean($stateParams.classDetails));
                

                var now = new Date(2015,3,20);
                var associatedRequestedClassId = $stateParams.classDetails ? $stateParams.classDetails.associatedRequestedClassId : null;
                
                var classToPost = {
                    name: $scope.newClass.name,
                    categoryName: $scope.newClass.category.name,
                    time: now,
                    associatedRequestedClassId: associatedRequestedClassId
                };
                
                console.log(classToPost);
                //
                //ClassesService.postClass(classToPost).then(function (response) {
                //    $scope.loading = false;
                //    $scope.message = response.data;
                //}, function (error) {
                //    $scope.loading = false;
                //    $scope.message = error;
                //});


                UpcomingClassesService.postClass(classToPost).then(function (response) {
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

});