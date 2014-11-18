var localLearnerApp = angular.module('localLearnerApp',['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'components/main/main.html',
                controller: 'MainCtrl'
            })
            .when('/teach', {
                templateUrl: 'components/teach/teach.html',
                controller: 'TeachCtrl'
            })
            .when('/request', {
                templateUrl: 'components/request/request.html',
                controller: 'RequestCtrl'
            })
    });