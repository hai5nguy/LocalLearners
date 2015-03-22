localLearnersApp.factory('RequestedClassesService', function ($http, $q) {

    //const _UPCOMING_CLASSES_TTL = 60000;
    //
    //var upcomingClassesPromise = null;

    return {

        addInterestedUser: addInterestedUser
        
        //getUpcomingClasses: getUpcomingClasses,
        //postUpcomingClasses: postUpcomingClasses,
        //getCategories: getCategories,
        //postClass: postClass,
        //postRequestedClass: postRequestedClass,
        //getRequestedClasses: getRequestedClasses,
        //getRequestedClass: getRequestedClass
    }


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Public Functions
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function addInterestedUser(requestedClassId) {
        var defer = $q.defer();
        $http.post('/api/requested/' + requestedClassId + '/addinteresteduser', {}).then(function (response) {
            console.log('1111 ', response);
            if (response && response.data && response.data.status === 'success') {
                defer.resolve(response.data.requestedClass);
            } else {
                console.error('RequestedClassesService addInterestedUser response: ', JSON.stringify(response));
                defer.reject('Unable to added you to requested class');
            }
        }, function (err) {
            console.error('RequestedClassesService addInterestedUser error: ', JSON.stringify(err));
            defer.reject('Unable to added you to requested class');
        });
        return defer.promise;
    }
    
    
    //function getUpcomingClasses() {
    //    var now = new Date();
    //    if (!upcomingClassesPromise || now - upcomingClassesPromise.lastUpdated > _UPCOMING_CLASSES_TTL) {
    //        var defer = $q.defer();
    //        $http.get('/upcomingclasses').then(function (response) {
    //            defer.resolve(response.data);
    //        }, function (err) {
    //            defer.reject(err);
    //        });
    //        upcomingClassesPromise = defer.promise;
    //        upcomingClassesPromise.lastUpdated = new Date();
    //        //console.log('guc new');
    //    } else {
    //        //console.log('guc using old');                
    //    }
    //    return upcomingClassesPromise;
    //}
    //
    //function postUpcomingClasses(upcomingClass) {
    //    return $http.post('/upcomingclasses', upcomingClass);
    //}
    //
    //function getCategories() {
    //    var defer = $q.defer();
    //    $http.get('/categories').then(function (response) {
    //        defer.resolve(response.data);
    //    },function (err) {
    //        defer.reject(err);
    //    });
    //    return defer.promise;
    //}
    //
    //function postClass(classToPost) {
    //    return $http.post('/upcomingclasses', classToPost);
    //}
    //
    //function postRequestedClass(requestedClassToPost) {
    //    return $http.post('/requestedclasses', requestedClassToPost);
    //}
    //
    //function getRequestedClasses() {
    //    var defer = $q.defer();
    //    $http.get('requestedclasses').then(
    //        function (response) {
    //            defer.resolve(response.data);
    //        },
    //        function (err) {
    //            defer.reject(err);
    //        }
    //    );
    //    return defer.promise;
    //}
    //
    //function getRequestedClass(id) {
    //    var defer = $q.defer();
    //    $http.get('/api/requested/' + id).then(
    //        function (response) {
    //            defer.resolve(response.data);
    //        },
    //        function (err) {
    //            defer.reject(err);
    //        }
    //    );
    //    return defer.promise;
    //}

});
