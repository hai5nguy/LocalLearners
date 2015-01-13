localLearnerApp.factory('AuthenticationSvc', function($http, $rootScope, UserProfile, AUTH_EVENTS) {
    return {
        getUser: function() {
//            return { thumb_link: 'http://placekitten.com/g/75/75' };

            return $http.get('/rest/v1/userprofile');

            //.then(function(data) {
//                console.log('userprofile authenticationsvc ', data);
//                return { thumb_link: 'http://placekitten.com/g/50/50' }
//            });

        },
        getUserProfile2: function() {
            return $http.get('/rest/v1/userprofile');
//                .then(function (res) {
//                    console.log('getuserprofile2 res ', res);
//
//                    //UserProfile.
//                });
        },
        isAuthenticated: function() {
            //return false;
            var authenticated = !!UserProfile.userId;

            //console.log('authenticationsvc isauthenticated ', UserProfile, authenticated);

            return authenticated;
        },
        initialize: function() {
            return $http.get('/rest/v1/userprofile').success(function(userProfile) {

                UserProfile.create('sessionid', userProfile.userId, userProfile.accessToken );
                console.log('authenticationsvc success', userProfile);

                if (!!userProfile.userId) {
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, userProfile);
                } else {
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                }

            });
        }

    }
});