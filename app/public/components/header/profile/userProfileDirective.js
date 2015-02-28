localLearnersApp.directive('llUserProfile', function(MeetupProfileSvc, $rootScope, AuthenticationService, AUTH_EVENTS, UserProfile) {

    var useTemplate = 'components/header/profile/profile.html';

//    $rootScope.$on('userAuthenticated', function () {
//        //alert('userauthenticated');
//        useTemplate = 'components/header/profile/loggedIn.html';
//        console.log('userauthenticated');
//    });

//
//
//
//    if (MeetupProfile.authenticated) {
//
//        useTemplate = 'components/header/profile/loggedIn.html';
//    } else {
//        useTemplate = 'components/header/profile/loggedOut.html';
//    }

    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/header/profile/userProfileDirective.html',
        controller: function($scope) {

//            $scope.Profile = MeetupProfile;
//
//            $scope.$on('userAuthenticated', function() {
//                $scope.$apply();
//
//
//            });

            $scope.signIn = function() {
                AuthenticationService.login();
            }
            $scope.signOut = function() {
                AuthenticationService.logout();
            }

            AuthenticationService.initialize();

            $scope.user = {
                isAuthenticated: function() { return AuthenticationService.isAuthenticated() }
            };
            //$scope.userAuthenticated = AuthenticationService.isAuthenticated();


            //$scope.userProfile = { thumb_link: 'http://placekitten.com/g/50/50' };
//                $scope.userProfile = data;

            //$scope.userProfile = AuthenticationService.getUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, function(event, data) {
                //console.log('event ', event);
                //console.log('data ', data);

                $scope.userProfile = UserProfile;

            });
            //$scope.userProfile = { thumb_link: 'http://placekitten.com/g/50/50' };

            //console.log('userprofile directive', $scope.userProfile);
        }
    }
});