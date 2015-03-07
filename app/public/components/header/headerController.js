localLearnersApp.controller('HeaderController', function($scope, $rootScope, EVENTS) {
    $scope.searchText = '';

    $scope.$watch('searchText', function(newSearchText, originalSearchText) {
        $rootScope.$emit(EVENTS.searchFilterUpdated, newSearchText);
    });

    $rootScope.$on(EVENTS.searchShortcutKeyPressed, function () {
        $('#headerSearchBox').val('').focus();
    });
});
