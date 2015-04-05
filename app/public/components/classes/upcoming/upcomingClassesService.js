localLearnersApp.factory('UpcomingClassesService', function ($http, $q) {

    return {
        getClass: getClass,
        getClasses: getClasses,
        postClass: postClass

    }


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Public Functions
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function getClass(id) {
        return $q(function (resolve, reject) {
            $http.get('/api/upcoming/' + id).then(function (response) {
                resolve(response.data);
            }, function (error) {
                reject(error);
            });
        });
    }
    function getClasses() {
        return $q(function (resolve, reject) {
            $http.get('/api/upcoming').then(function (response) {
                resolve(response.data);
            }, function (error) {
                reject(error);
            })
        });
    }
    
    function postClass(classToPost) {
        return $http.post('/api/upcoming/', classToPost);
    }
    
});
