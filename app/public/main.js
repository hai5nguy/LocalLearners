var localLearnersApp = angular.module('localLearnersApp',['ngResource', 'ui.router'])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {

        
        //
        //routerApp.config(function($stateProvider, $urlRouterProvider) {
        //
        //    $urlRouterProvider.otherwise('/home');
        //
        //    $stateProvider
        //
        //        // HOME STATES AND NESTED VIEWS ========================================
        //        .state('home', {
        //            url: '/home',
        //            templateUrl: 'partial-home.html'
        //        })
        //
        //        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        //        .state('about', {
        //            // we'll get to this in a bit       
        //        });
        //
        //});

        $urlRouterProvider.otherwise('/');
        
        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: '/components/main/main.html'
            })
            .state('classes', {
                url: '/classes',
                templateUrl: '/components/classes/classes.html'
            });

        $locationProvider.html5Mode(true);


//        $routeProvider
//            .when('/', {
//                templateUrl: 'components/main/main.html',
//                controller: 'MainCtrl'
//            })
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
//            .when('/host', {
//                templateUrl: 'components/host/host.html'
//                //controller: 'HostCtrl'
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
//            .when('/teach', {
//                templateUrl: 'components/teach/teach.html'
//                //controller: 'TeachCtrl'
//            })
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

    }).constant('EVENTS', {
        searchCommencing: 'search-commencing',
        searchFilterUpdated: 'search-filter-updated',
        searchShortcutKeyPressed: 'search-shortcut-key-pressed',
        authUserLoggedIn: 'auth-user-logged-in',
        authUserLoggedOut: 'auth-user-logged-out',
        topRequestedClassesFilter: 'top-requested-classes-filter'
    });
