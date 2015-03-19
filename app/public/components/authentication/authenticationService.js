localLearnersApp.factory('AuthenticationService', function($http, $q, $rootScope, UserProfile, EVENTS) {

    return {
        login: login,
        logout: logout,
        checkAuthenticated: checkAuthenticated,
        initialize: initialize
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Public Functions
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function login() {
        window.location = '/login';
    }
    
    function logout() {
        $http.get('/logout').then(function(response) {
            console.log('logging out response:', response);
            if (response.data && response.data.message === 'success') {
                $rootScope.$emit(EVENTS.authUserLoggedOut);
                UserProfile.destroy();
            }
        }, function (err) {
            console.error('AuthenticationService failed to logout user: ', err);
        })
    }
    
    function checkAuthenticated() {
        var getProfile = $http.get('/profile');
        getProfile.then(function (response) {
            if (response.data && response.data.meetupId) {
                UserProfile.create(response.data);
                $rootScope.$emit(EVENTS.authUserLoggedIn);
            }
        }, function (err) {
            console.error('AuthenticationService error on get /profile, err: ', err);
        });
    }
    
    function initialize() {
        CheckToSeeIfUserIsLoggedIn();
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Private Functions
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    function CheckToSeeIfUserIsLoggedIn() {
        return $http.get('/profile').success(function(profile) {

            UserProfile.create(profile);
            if (!!UserProfile.mid) {
                $rootScope.$broadcast(EVENTS.authUserLoggedIn);
            }
        });
    }

    
});
