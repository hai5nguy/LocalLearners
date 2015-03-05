localLearnersApp.directive('llRequestedClasses', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/classes/requestedclasses/requestedClassesTemplate.html',
        controller: function($scope, $rootScope, ClassesService) {
            ClassesService.getRequestedClasses().then(function(requestedClasses) {

                var requestedGroup = _.groupBy(requestedClasses, function (r) { return r.category.name });

                _.each(requestedGroup, function(group, i) {
                    requestedGroup[i] = _.first(
                        _.sortBy(group, function (r) {
                            return r.interestedMembers.length;
                        }), 4);
                });

                $scope.requestedGroup = requestedGroup;
            }, function (err) {
                //todo: handle errors
                console.log('requestedclassesdirective error');
            });

        }
    }
});
