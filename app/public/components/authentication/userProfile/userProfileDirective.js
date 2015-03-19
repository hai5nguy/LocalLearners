localLearnersApp.directive('llUserProfile', function($rootScope, AuthenticationService, EVENTS, CurrentUser) {

    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/authentication/userProfile/userProfileDirective.html',
        controller: controller
    }
    
    function controller($scope) {
        $scope.authenticated = false;

        $scope.login = AuthenticationService.login;
        $scope.logout = AuthenticationService.logout;

        AuthenticationService.checkAuthenticated();
        
        $rootScope.$on(EVENTS.authUserLoggedOut, function (event, data) {
            $scope.authenticated = false;
        });
        
        $rootScope.$on(EVENTS.authUserLoggedIn, function (event, data) {
            $scope.authenticated = true;
            $scope.user = CurrentUser;
        });
        
    }

});
