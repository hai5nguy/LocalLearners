localLearnerApp.controller('ProfileController', function($scope) {
    $scope.user = {
        name: 'Hai Naagooooooooyen',
        lastLoggedIn: function() { return new Date() }
    };
});