localLearnersApp
    .controller('HaiTestController', function($scope) {
        $scope.loading = true;

        $scope.blah = function() {
//            alert('blah');
            $scope.loading = false;
            $scope.$apply();
        }

    });