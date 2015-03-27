var localLearnersApp = angular.module('localLearnersApp',['ngResource', 'ui.router'])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {

        //$urlRouterProvider.otherwise('/');

        $locationProvider.html5Mode(true);

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/components/home/home.html'
            })
            .state('upcoming', {
                url: '/upcoming',
                templateUrl: '/components/classes/upcoming.html'
            })
            .state('createupcoming', {
                url: '/createupcoming',
                templateUrl: '/components/classes/createupcoming.html'
            })
            .state('requested', {
                abstract: true,
                url: '/requested',
                templateUrl: '/components/classes/requested/requested.html'
            })
            .state('requested.list', {
                url: '',
                templateUrl: '/components/classes/requested/list.html'
            })
            .state('requested.detail', {
                url: '/:id',
                templateUrl: '/components/classes/requested/detail.html'
            })
            .state('createrequest', {
                url: '/createrequest',
                templateUrl: '/components/classes/createrequest.html'
            })
            .state('teach', {
                //url: '/teach',
                templateUrl: '/components/teach/teach.html',
                controller: 'TeachController',
                params: { classDetails: null }
            })
            .state('host', {
                url: '/host',
                templateUrl: 'components/host/host.html'
            });

//            .when('/about', {
//                templateUrl: 'components/about/about.html'
//                //controller: 'AboutCtrl'
//            })
//            .when('/account', {
//                templateUrl: 'components/account/account.html',
////                controller: 'AccountCtrl'
//            })
////            .when('/authenticate', {
////                templateUrl: 'components/authenticate/authenticate.html',
////                controller: 'AuthenticateCtrl'
////            })
//            .when('/categories', {
//                templateUrl: 'components/categories/categories.html'
//                //controller: 'CategoriesCtrl'
//            })
//            .when('/classes', {
//                templateUrl: 'components/classes/classes.html',
////                controller: 'ClassesCtrl'
//            })
//            .when('/contact', {
//                templateUrl: 'components/contact/contact.html'
//                //controller: 'ContactCtrl'
//            })
//            .when('/customfont', {
//                templateUrl: 'components/customfont/customfont.html'
//                //controller: 'customfontCtrl'
//            })
//            .when('/faq', {
//                templateUrl: 'components/help/help.html',
////                controller: 'HelpCtrl'
//            })
//            .when('/feedback', {
//                templateUrl: 'components/contact/contact.html',
////                controller: 'ContactCtrl'
//            })
//            .when('/help', {
//                templateUrl: 'components/help/help.html',
////                controller: 'HelpCtrl'
//            })
//            .when('/locations', {
//                templateUrl: 'components/contact/contact.html',
//                //controller: 'ContactCtrl'
//            })
//            .when('/privacy', {
//                templateUrl: 'components/privacy/privacy.html',
//                //controller: 'PrivacyCtrl'
//            })
//            .when('/profile', {
//                templateUrl: 'components/profile/profile.html',
//                //controller: 'ProfileCtrl'
//            })
//            .when('/request', {
//                templateUrl: 'components/request/request.html',
////                controller: 'RequestCtrl'
//            })
//            .when('/requested', {
//                templateUrl: 'components/requested/requested.html',
////                controller: 'RequestedCtrl'
//            })
//
//            .when('/terms', {
//                templateUrl: 'components/terms/terms.html',
////                controller: 'TermsCtrl'
//            })
//            .when('/haitest', {
//                templateUrl: 'haitest.html',
//                controller: 'HaiTestController'
//            });
//
//        $locationProvider.html5Mode(true);

    })
    .constant('EVENTS', {
        searchCommencing: 'search-commencing',
        searchFilterUpdated: 'search-filter-updated',
        searchShortcutKeyPressed: 'search-shortcut-key-pressed',
        authUserLoggedIn: 'auth-user-logged-in',
        authUserLoggedOut: 'auth-user-logged-out',
        topRequestedClassesFilter: 'top-requested-classes-filter'
    });
