localLearnerApp.factory('AuthenticationSvc', function($http) {
    return {
        getUser: function() {
//            return { thumb_link: 'http://placekitten.com/g/75/75' };

            return $http.get('/rest/v1/userprofile');

            //.then(function(data) {
//                console.log('userprofile authenticationsvc ', data);
//                return { thumb_link: 'http://placekitten.com/g/50/50' }
//            });

        }
    }
});