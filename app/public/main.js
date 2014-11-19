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
            .when('/contact', {
                templateUrl: 'components/contact/contact.html',
                controller: 'ContactCtrl'
            })
            .when('/feedback', {
                templateUrl: 'components/feedback/feedback.html',
                controller: 'FeedbackCtrl'
            })
            .when('/about', {
                templateUrl: 'components/about/about.html',
                controller: 'AboutCtrl'
            })
            .when('/privacy', {
                templateUrl: 'components/privacy/privacy.html',
                controller: 'PrivacyCtrl'
            })
            .when('/terms', {
                templateUrl: 'components/terms/terms.html',
                controller: 'TermsCtrl'
            })
            .when('/help', {
                templateUrl: 'components/help/help.html',
                controller: 'HelpCtrl'
            })
    });
