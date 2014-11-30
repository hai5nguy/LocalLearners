localLearnerApp.directive('llUserProfile', function(MeetupProfile, $rootScope) {

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
        templateUrl: 'components/header/profile/profile.html',
        controller: function($scope, MeetupProfile) {
            $scope.userAuthenticated = MeetupProfile.authenticated;
            $scope.Profile = MeetupProfile;

            $scope.$on('userAuthenticated', function() {
                $scope.$apply();


            });

            $scope.signIn = function() {
                var url = 'https://secure.meetup.com/oauth2/authorize?client_id=h0dl8qkd82gbjan5cpr8plb4jq&response_type=token&redirect_uri=http://localhost:5000/authenticate/?returnurl=/';
                window.location = url;
            }
        }
    }
});