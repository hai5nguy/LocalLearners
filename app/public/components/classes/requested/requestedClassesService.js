localLearnersApp.factory('RequestedClassesService', function ($http, $q) {

    return {
        getClasses: getClasses,
        postClass: postClass,
        setUserInterested: setUserInterested
    }


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Public Functions
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function getClasses() {
        var defer = $q.defer();
        $http.get('/api/requested').then(function (response) {
            defer.resolve(response.data);
        }, function (err) {
            defer.reject(err);
        });
        return defer.promise;
    }

    
    function setUserInterested(classId, interested) {
        var defer = $q.defer();

        $http.post('/api/requested/' + classId + '/setuserinterested', { interested: interested }).then(function (response) {
            console.log('1111 ', response);
            if (response && response.data && response.data.status === 'success') {
                defer.resolve(response.data.requestedClass);
            } else {
                console.error('RequestedClassesService setuserinterested response: ', JSON.stringify(response));
                defer.reject('Unable to added you to requested class');
            }
        }, function (err) {
            console.error('RequestedClassesService setuserinterested error: ', JSON.stringify(err));
            defer.reject('Unable to added you to requested class');
        });
            
        return defer.promise;
    }

    function postClass(requestedClassToPost) {
        return $http.post('/api/requested', requestedClassToPost);
    }
    
});
