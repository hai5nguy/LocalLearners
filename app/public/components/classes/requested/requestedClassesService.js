localLearnersApp.factory('RequestedClassesService', function ($http, $q) {

    return {
        setUserInterested: setUserInterested
    }


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Public Functions
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function setUserInterested(requestedClassId, interested) {
        var defer = $q.defer();

        $http.post('/api/requested/' + requestedClassId + '/setuserinterested', { interested: interested }).then(function (response) {
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
    
});
