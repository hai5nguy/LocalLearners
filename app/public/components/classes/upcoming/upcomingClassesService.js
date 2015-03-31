localLearnersApp.factory('UpcomingClassesService', function ($http, $q) {

    return {
        getClasses: getClasses,
        postClass: postClass

    }


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Public Functions
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function getClasses() {
        var defer = $q.defer();
        $http.get('/api/upcoming').then(function (response) {
            console.log('555 ', response.data);
            defer.resolve(response.data);
        }, function (error) {
            defer.reject(error);
        })
        return defer.promise;
    }
    
    function postClass(classToPost) {
        return $http.post('/api/upcoming/', classToPost);
    }
    
});
