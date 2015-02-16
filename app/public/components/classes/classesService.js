localLearnersApp.factory('ClassesService', function ($http, UserProfile) {
    return {
        getUpcomingClasses: function(callback) {
            $http.get('/upcomingclasses').success(function(classes) {
                callback(classes);
            });
        },
        postUpcomingClasses: function(upcomingClass, callback) {
            $http.post('/upcomingclasses', upcomingClass);
        },
        getCategories: function(callback) {
            $http.get('/categories')
                .success(function(categories) {
                    categories = _.sortBy(categories, "name");
                    categories.unshift({ name: 'All Categories', value: '' });
                    callback(categories);
                });
        }
    }
})