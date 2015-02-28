localLearnersApp
    .controller('HaiTestController', function($scope, ClassesService) {
        $scope.loading = false;
        $scope.result = {};

        $scope.blah = function() {
            $scope.loading = true;

            var now = new Date(2015,3,20);
            var classToPost = {
                name: 'test class name ' + now.getTime(),
                category: 'Technology',
                time: now
            };

            ClassesService.postClass(classToPost).then(
                function (response) {
                    $scope.loading = false;
                    $scope.result = response.data;
                },
                function (error) {

                }
            );


        }

    });