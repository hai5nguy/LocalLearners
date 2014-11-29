localLearnerApp.factory('MeetupProfile', function($resource) {
    var _accessToken;

    return {
        login: function() {

            return $resource('https://secure.meetup.com/oauth2/authorize?client_id=h0dl8qkd82gbjan5cpr8plb4jq&response_type=token&redirect_uri=http://localhost:5000');
        },
        importTokenFromHash: function(hashString) {
            if (!hashString) return;
            var pairs = hashString.split('&');
            this.accessToken = pairs[2].split('=')[1];
        },

        get accessToken() { return _accessToken; },
        set accessToken(token) { _accessToken = token }


    }
});


//https://secure.meetup.com/oauth2/authorize?client_id=h0dl8qkd82gbjan5cpr8plb4jq&response_type=token&redirect_uri=http://localhost:5000
