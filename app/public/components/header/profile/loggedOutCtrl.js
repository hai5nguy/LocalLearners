localLearnerApp.controller('LoggedOutCtrl', function($scope) {
    $scope.login = function () {
        window.location = 'https://secure.meetup.com/oauth2/authorize?client_id=h0dl8qkd82gbjan5cpr8plb4jq&response_type=token&redirect_uri=http://localhost:5000';
    }
});