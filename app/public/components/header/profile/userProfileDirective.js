localLearnerApp.directive('llUserProfile', function(MeetupProfileSvc, $rootScope) {

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
           $scope.userAuthenticated = false;
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

            $scope.userProfile = MeetupProfileSvc.getUserProfile();
            console.log($scope.userProfile);
        }
    }
});