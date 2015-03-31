localLearnersApp.factory('CategoryService', function ($http, $q) {

    return {
        getAll: getAll
    }

    function getAll() {
        var defer = $q.defer();
        $http.get('/api/category/all').then(function (response) {
            defer.resolve(response.data);
        },function (err) {
            defer.reject(err);
        });
        return defer.promise;
    }

});
