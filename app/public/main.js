var localLearnerApp = angular.module('localLearnerApp',['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider.when('/',
            {
                templateUrl: 'components/main/main.html',
                controller: 'MainCtrl'
            })
    });