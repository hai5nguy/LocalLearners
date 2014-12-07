var localLearnerApp = angular.module('localLearnerApp',['ngResource', 'ngRoute'])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'components/main/main.html',
                controller: 'MainCtrl'
            })
            .when('/about', {
                templateUrl: 'components/about/about.html'
                //controller: 'AboutCtrl'
            })
            .when('/account', {
                templateUrl: 'components/account/account.html',
                controller: 'AccountCtrl'
            })
            .when('/authenticate', {
                templateUrl: 'components/authenticate/authenticate.html',
                controller: 'AuthenticateCtrl'
            })
            .when('/categories', {
                templateUrl: 'components/categories/categories.html'
                //controller: 'CategoriesCtrl'
            })
            .when('/classes', {
                templateUrl: 'components/classes/classes.html',
                controller: 'ClassesCtrl'
            })
            .when('/contact', {
                templateUrl: 'components/contact/contact.html'
                //controller: 'ContactCtrl'
            })
            .when('/customfont', {
                templateUrl: 'components/customfont/customfont.html'
                //controller: 'customfontCtrl'
            })
            .when('/faq', {
                templateUrl: 'components/help/help.html',
                controller: 'HelpCtrl'
            })
            .when('/feedback', {
                templateUrl: 'components/contact/contact.html',
                controller: 'ContactCtrl'
            })
            .when('/help', {
                templateUrl: 'components/help/help.html',
                controller: 'HelpCtrl'
            })
            .when('/host', {
                templateUrl: 'components/host/host.html',
                controller: 'HostCtrl'
            })
            .when('/locations', {
                templateUrl: 'components/contact/contact.html',
                controller: 'ContactCtrl'
            })
            .when('/login', {
                templateUrl: 'components/login/login.html',
                controller: 'LoginCtrl'
            })
            .when('/logout', {
                templateUrl: 'components/logout/logout.html',
                controller: 'LogoutCtrl'
            })
            .when('/privacy', {
                templateUrl: 'components/privacy/privacy.html',
                controller: 'PrivacyCtrl'
            })
            .when('/profile', {
                templateUrl: 'components/profile/profile.html',
                controller: 'ProfileCtrl'
            })
            .when('/request', {
                templateUrl: 'components/request/request.html',
                controller: 'RequestCtrl'
            })
            .when('/requested', {
                templateUrl: 'components/requested/requested.html',
                controller: 'RequestedCtrl'
            })
            .when('/signin', {
                templateUrl: 'components/login/login.html',
                controller: 'LoginCtrl'
            })
            .when('/signout', {
                templateUrl: 'components/logout/logout.html',
                controller: 'LogoutCtrl'
            })
            .when('/teach', {
                templateUrl: 'components/teach/teach.html'
                //controller: 'TeachCtrl'
            })
            .when('/terms', {
                templateUrl: 'components/terms/terms.html',
                controller: 'TermsCtrl'
            });

        $locationProvider.html5Mode(true);

    });