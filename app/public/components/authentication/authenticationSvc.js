localLearnersApp.factory('AuthenticationSvc', function($http, $rootScope, UserProfile, AUTH_EVENTS) {

    function CheckToSeeIfUserIsLoggedIn() {
        return $http.get('/profile').success(function(profile) {

            UserProfile.create(profile);
            if (!!UserProfile.mid) {
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            }
        });
    }

    return {
        login: function() {
            window.location = '/authenticate';
        },
        logout: function() {
            $http.get('/logout');
            UserProfile.destroy();
        },
        isAuthenticated: function() {
            //return false;
            var authenticated = !!UserProfile.mid;

            //console.log('authenticationsvc isauthenticated ', UserProfile, authenticated);

            return authenticated;
        },
        initialize: function() {
            CheckToSeeIfUserIsLoggedIn();
        }

    }
});