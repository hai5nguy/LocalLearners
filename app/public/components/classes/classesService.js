localLearnersApp.factory('ClassesService', function ($http, $q) {
    return {
        getUpcomingClasses: getUpcomingClasses,
        postUpcomingClasses: postUpcomingClasses,
        getCategories: getCategories,
        postClass: postClass,
        postRequestedClass: postRequestedClass,
        getRequestedClasses: getRequestedClasses
    }

    function getUpcomingClasses(callback) {
        $http.get('/upcomingclasses').success(function(classes) {
            callback(classes);
        });
    }

    function postUpcomingClasses(upcomingClass) {
        return $http.post('/upcomingclasses', upcomingClass);
    }

    function getCategories() {
        var defer = $q.defer();
        $http.get('/categories').then(
            function (response) {
                defer.resolve(response.data);
            },
            function (err) {
                defer.reject(err);
            }
        );
        return defer.promise;
    }

    function postClass(classToPost) {
        return $http.post('/upcomingclasses', classToPost);
    }

    function postRequestedClass(requestedClassToPost) {
        return $http.post('/requestedclasses', requestedClassToPost);
    }

    function getRequestedClasses() {
        var defer = $q.defer();
        $http.get('/requestedclasses').then(
            function (response) {
                defer.resolve(response.data);
            },
            function (err) {
                defer.reject(err);
            }
        );
        return defer.promise;
    }

})