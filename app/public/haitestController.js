localLearnersApp
    .controller('HaiTestController', function($scope, ClassesService) {
        $scope.loading = false;
        $scope.result = {};

        $scope.blah = function() {

            ClassesService.getRequestedClasses().then(function(response) {
                console.log('aaa ', response.data);
            });


        }

    });