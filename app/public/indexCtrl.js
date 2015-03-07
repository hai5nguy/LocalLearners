localLearnersApp
    .controller('IndexCtrl', function($scope, $rootScope, $document, MeetupProfileSvc, EVENTS) {
        $scope.appSettings = {
            url: {
                header: 'components/header/header.html',
                footer: 'components/footer/footer.html'
            }
        }
        $scope.userAuthenticated =  MeetupProfileSvc.authenticated;


        //$document[0].addEventListener('keypress', function(e) {
        //    if (e.which == 47) {
        //        console.log('yo 47');
        //        $rootScope.$emit(EVENTS.searchShortcutKeyPressed, '');
        //        e.preventDefault();
        //    }
        //}, false);
        //
        $document.bind('keypress', function(e) {

            if (e.which == 47) {  // 47 = /
                console.log('yo 47');
                $rootScope.$emit(EVENTS.searchShortcutKeyPressed);
                e.preventDefault();
                return false;
            }
            //console.log('Got keypress:', e.which);
            //$rootScope.$broadcast('keypress', e);
            //$rootScope.$broadcast('keypress:' + e.which, e);
        });

    })
    .directive('includeReplace', function () {
        return {
            require: 'ngInclude',
            restrict: 'A', /* optional */
            link: function (scope, el, attrs) {
                el.replaceWith(el.children());
            }
        };
    });
