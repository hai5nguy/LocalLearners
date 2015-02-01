localLearnersApp.directive('LLUpcomingClasses', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/classes/upcomingclasses/upcomingClassesDirective.html',
        controller: function($scope) {
            alert('in llupcomingclasses');
        }
    }
});