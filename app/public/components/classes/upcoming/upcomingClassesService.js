localLearnersApp.factory('UpcomingClassesService', function ($http, $q) {

    return {
        getClass: getClass,
        getClasses: getClasses,
        postClass: postClass,
        RSVP: {
            set: RSVP_set
        }

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
    
    function RSVP_set(classId, isAttending) {
        return $q(function (resolve, reject) {

            $http.post('/api/upcoming/' + classId + '/setrsvp', { isAttending: isAttending }).then(function (response) {
                if (response && response.data && response.data.status === 'success') {
                    resolve(response.data.upcomingClass);
                } else {
                    reject('Unable to add you to rsvp list you.');
                }
            }, function (error) {
                reject('Unable to add you to rsvp list you.  Error: ', error);
            });
            
        });
    }
});
