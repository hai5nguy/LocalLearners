localLearnersApp.directive('llClassCreationForm', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/teach/classcreationform/classCreationFormTemplate.html',
        controller: function($scope, ClassesService) {
            $scope.loading = false;
            $scope.newClass = {};

            $scope.submit = function() {
                $scope.loading = true;

                var now = new Date(2015,3,20);
                var classToPost = {
                    name: $scope.newClass.name,
                    category: 'Technology',
                    time: now
                };

                ClassesService.postClass(classToPost).then(
                    function (response) {
                        $scope.loading = false;
                        $scope.message = response.data;
                    },
                    function (error) {

                    }
                );
            }
        }
    }
});