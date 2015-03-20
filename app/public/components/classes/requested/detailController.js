localLearnersApp.controller('Requested.DetailController', function($scope, $stateParams) {
    $scope.name = $stateParams.id;
    console.log('detail controller loaded in requested');
});
