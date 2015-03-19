localLearnersApp.controller('IndexCtrl', function($scope, $rootScope, $document, EVENTS) {
    $scope.templates = {
        header: 'components/header/header.html',
        footer: 'components/footer/footer.html'
    };

    $document.bind('keypress', function(e) {
        if (e.which == 47) {  // 47 = /
            $rootScope.$emit(EVENTS.searchShortcutKeyPressed);
            e.preventDefault();
        }
    });

});
