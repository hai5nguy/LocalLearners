localLearnerApp.directive('llUserProfile', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/header/profile/loggedOut.html'
    }
});