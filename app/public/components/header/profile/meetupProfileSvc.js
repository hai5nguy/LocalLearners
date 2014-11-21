localLearnerApp.factory('meetProfile', function($resource) {
    return {
        login: function() {

            return $resource('https://secure.meetup.com/oauth2/authorize?client_id=h0dl8qkd82gbjan5cpr8plb4jq&response_type=token&redirect_uri=http://localhost:5000');
        }
   }
});


https://secure.meetup.com/oauth2/authorize?client_id=h0dl8qkd82gbjan5cpr8plb4jq&response_type=token&redirect_uri=http://localhost:5000
