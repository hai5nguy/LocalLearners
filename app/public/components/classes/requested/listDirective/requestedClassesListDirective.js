localLearnersApp.directive('llRequestedClassesList', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'components/classes/requested/listDirective/requestedClassesTemplate.html',
        controller: controller
    }

    function controller($scope, RequestedClassesService) {
        RequestedClassesService.getClasses().then(function(requestedClasses) {
            var requestedGroup = _.groupBy(requestedClasses, function (r) { return r.category.name });

            _.each(requestedGroup, function(group, i) {
                requestedGroup[i] = _.first(
                    _.sortBy(group, function (r) {
                        return -r.interestedUsers.length;
                    }), 4);
            });

            $scope.requestedGroup = requestedGroup;
        }, function (err) {
            //todo: handle errors
            console.log('requestedclassesdirective error');
        });

    }
    
});
