localLearnersApp.factory('AuthenticationService', function($http, $rootScope, UserProfile, EVENTS) {

    function CheckToSeeIfUserIsLoggedIn() {
        return $http.get('/profile').success(function(profile) {

            UserProfile.create(profile);
            if (!!UserProfile.mid) {
                $rootScope.$broadcast(EVENTS.authLoginSuccess);
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
            return !!UserProfile.mid;
        },
        initialize: function() {
            CheckToSeeIfUserIsLoggedIn();
        }

    }
});
