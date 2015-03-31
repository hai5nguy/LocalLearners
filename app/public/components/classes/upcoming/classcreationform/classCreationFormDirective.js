localLearnersApp.directive('llClassCreationForm', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'components/classes/upcoming/classcreationform/classCreationFormTemplate.html',
        controller: controller
    }

    function controller ($scope, $rootScope, CategoryService, EVENTS, $stateParams, $q, UpcomingClassesService) {
        $scope.loading = false;
        $scope.newClass = {};

        loadCategories()
            .then(handlePassedInClassDetails);

        hookupSubmit();
        hookupNewClassNameChanged();

        function loadCategories() {
            var defer = $q.defer();
            CategoryService.getAll().then(function (categories) {
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
                $scope.newClass.category = _.findWhere($scope.categories, { _id: $stateParams.classDetails.category });
            }
        }

        function hookupSubmit() {

            $scope.submit = function() {
                //todo: validation
                $scope.loading = true;
                
                var now = new Date(2015,3,20);
                var associatedRequestedClassId = $stateParams.classDetails ? $stateParams.classDetails.associatedRequestedClassId : null;
                
                var classToPost = {
                    name: $scope.newClass.name,
                    category: $scope.newClass.category._id,
                    time: now,
                    associatedRequestedClassId: associatedRequestedClassId
                };
                
                console.log(classToPost);

                UpcomingClassesService.postClass(classToPost).then(function (response) {
                    $scope.loading = false;
                    $scope.message = response.data;
                    
                    //createdUpcomingClass
                    
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