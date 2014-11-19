var localLearnerApp = angular.module('localLearnerApp',['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'components/main/main.html',
                controller: 'MainCtrl'
            })
            .when('/classes', {
                templateUrl: 'components/classes/classes.html',
                controller: 'ClassesCtrl'
            })
            .when('/teach', {
                templateUrl: 'components/teach/teach.html',
                controller: 'TeachCtrl'
            })
            .when('/host', {
                templateUrl: 'components/host/host.html',
                controller: 'HostCtrl'
            })
            .when('/categories', {
                templateUrl: 'components/categories/categories.html',
                controller: 'CategoriesCtrl'
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
                templateUrl: 'components/contact/contact.html',
                controller: 'ContactCtrl'
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
            .when('/profile', {
                templateUrl: 'components/profile/profile.html',
                controller: 'ProfileCtrl'
            })
            .when('/account', {
                templateUrl: 'components/account/account.html',
                controller: 'AccountCtrl'
            })
            .when('/logout', {
                templateUrl: 'components/logout/logout.html',
                controller: 'LogoutCtrl'
            })
    });