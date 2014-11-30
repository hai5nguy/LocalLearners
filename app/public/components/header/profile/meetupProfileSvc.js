localLearnerApp.factory('MeetupProfile', function($resource, $rootScope, $http) {
    var _accessToken;
    var _authenticated = false;

    return {
        login: function() {

            return $resource('https://secure.meetup.com/oauth2/authorize?client_id=h0dl8qkd82gbjan5cpr8plb4jq&response_type=token&redirect_uri=http://localhost:5000');
        },
        importTokenFromHash: function(hashString) {
            if (!hashString) return;
            var pairs = hashString.split('&');
            this.accessToken = pairs[2].split('=')[1];
            this.authenticated = true;
            this.getProfileInfo();
            $rootScope.$broadcast('userAuthenticated');
        },

        get accessToken() { return _accessToken; },
        set accessToken(token) { _accessToken = token; },

        get authenticated() { return _authenticated },
        set authenticated(value) { _authenticated = value; },

        get name() { return 'blah'; },

        getProfileInfo: function() {
            $http({method: 'GET', url: 'https://api.meetup.com/2/member/self?access_token=' + this.accessToken, headers: {'Authorization': 'Bearer '+ this.accessToken}}).then(function(response){
                console.log(response);
            });
        }

    }
});


//https://secure.meetup.com/oauth2/authorize?client_id=h0dl8qkd82gbjan5cpr8plb4jq&response_type=token&redirect_uri=http://localhost:5000
