localLearnerApp.directive('llUserProfile', function(MeetupProfileSvc, $rootScope, AuthenticationSvc) {

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
        controller: function($scope) {
            console.log("yoooo");
           $scope.userAuthenticated = true;
//            $scope.Profile = MeetupProfile;
//
//            $scope.$on('userAuthenticated', function() {
//                $scope.$apply();
//
//
//            });

            $scope.signIn = function() {

                var url = '/authenticate';
                window.location = url;
            }

            AuthenticationSvc.getUser().success(function(data) {
                $scope.userProfile = data;
            })
            //$scope.userProfile = AuthenticationSvc.getUser();

            //$scope.userProfile = { thumb_link: 'http://placekitten.com/g/100/100' };

            console.log('userprofile directive', $scope.userProfile);
        }
    }
});