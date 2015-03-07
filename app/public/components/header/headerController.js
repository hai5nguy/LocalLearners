localLearnersApp.controller('HeaderController', function($scope, $rootScope, EVENTS) {
    $scope.searchText = '';

    $scope.$watch('searchText', function(newSearchText, originalSearchText) {
        $rootScope.$emit(EVENTS.searchFilterUpdated, newSearchText);
    });
    
    var searchBox = $('#headerSearchBox');

    $rootScope.$on(EVENTS.searchShortcutKeyPressed, function () {
        searchBox.val('');
        searchBox.focus();
    });

    $scope.searchBoxOnFocus = function () {
        searchBox.select();
        $rootScope.$emit(EVENTS.searchCommencing);
    }
});
