localLearnersApp.controller('IndexCtrl', function($scope, $rootScope, $document, MeetupProfileSvc, EVENTS) {
    $scope.appSettings = {
        url: {
            header: 'components/header/header.html',
            footer: 'components/footer/footer.html'
        }
    };
    
    $scope.userAuthenticated =  MeetupProfileSvc.authenticated;

    $document.bind('keypress', function(e) {
        if (e.which == 47) {  // 47 = /
            $rootScope.$emit(EVENTS.searchShortcutKeyPressed);
            e.preventDefault();
        }
    });

});
