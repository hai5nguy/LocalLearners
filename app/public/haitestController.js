localLearnersApp.controller('HaiTestController', function($scope, UpcomingClassesService) {

        $scope.blah = function() {
            
            UpcomingClassesService.postClass({
                name: 'test1',
                category: 'categoryid',
                time: new Date()
            });
        }

    });