localLearnersApp.factory('AuthenticationService', function($http, $q, $rootScope, CurrentUser, EVENTS) {

    return {
        login: login,
        logout: logout,
        checkAuthenticated: checkAuthenticated
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Public Functions
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function login() {
        window.location = '/login';
    }
    
    function logout() {
        $http.get('/logout').then(function(response) {
            //console.log('logging out response:', response);
            if (response.data && response.data.message === 'success') {
                $rootScope.$emit(EVENTS.authUserLoggedOut);
                CurrentUser.destroy();
            }
        }, function (err) {
            console.error('AuthenticationService failed to logout user: ', err);
        })
    }
    
    function checkAuthenticated() {
        var getProfile = $http.get('/profile');
        getProfile.then(function (response) {
            if (response.data && response.data.meetupId) {
                CurrentUser.create(response.data);
                $rootScope.$emit(EVENTS.authUserLoggedIn);
            }
        }, function (err) {
            console.error('AuthenticationService error on get /profile, err: ', err);
        });
    }
    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Private Functions
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
});
