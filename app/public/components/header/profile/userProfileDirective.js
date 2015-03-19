localLearnersApp.directive('llUserProfile', function(MeetupProfileSvc, $rootScope, AuthenticationService, EVENTS, UserProfile) {

    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/header/profile/userProfileDirective.html',
        controller: controller
    }
    
    function controller($scope) {
        $scope.authenticated = false;

        $scope.login = AuthenticationService.login;
        $scope.logout = AuthenticationService.logout;

        //AuthenticationService.initialize();

        //var checkAuthenticated = 
            
        AuthenticationService.checkAuthenticated();
        
        //
        //checkAuthenticated.then(function (isAuthenticated) {
        //    console.log('111', isAuthenticated);
        //    if (isAuthenticated) {
        //        console.log('222');
        //
        //    } else {
        //        $scope.authenticated = false;
        //    }
        //}, function (err) {
        //    console.error('AuthenticationService: fail to check authenticated: ', err);
        //});


        //$scope.user = {
        //isAuthenticated: function() { return AuthenticationService.isAuthenticated() }
        //};
        //$scope.userAuthenticated = AuthenticationService.isAuthenticated();


        //$scope.userProfile = { thumb_link: 'http://placekitten.com/g/50/50' };
//                $scope.userProfile = data;

        //$scope.userProfile = AuthenticationService.getUser();

        //$rootScope.$on(EVENTS.authUserLoggedIn, function(event, data) {
            //console.log('event ', event);
            //console.log('data ', data);

            //$scope.userProfile = UserProfile;

        //});
        
        $rootScope.$on(EVENTS.authUserLoggedOut, function (event, data) {
            $scope.authenticated = false;
        });
        
        $rootScope.$on(EVENTS.authUserLoggedIn, function (event, data) {
            $scope.authenticated = true;
            $scope.user = UserProfile;
        });
        //$scope.userProfile = { thumb_link: 'http://placekitten.com/g/50/50' };

        //console.log('userprofile directive', $scope.userProfile);
    }

});
