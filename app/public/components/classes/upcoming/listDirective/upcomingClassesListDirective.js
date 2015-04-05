localLearnersApp.directive('llUpcomingClassesList', function() {
    
    const _templateForTileView = 'components/classes/upcoming/listDirective/upcomingTileViewTemplate.html';
    const _templateForListView = 'components/classes/upcoming/listDirective/upcomingListViewTemplate.html';
    
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: determineWhichTemplateToUse,
        controller: controller
    }
    
    function determineWhichTemplateToUse(element, attributes) {
        if (!attributes.view) throw 'Upcoming Classes directive needs a view attribute';
        if (attributes.view == 'tile') {
            return _templateForTileView;
        } else if (attributes.view == 'list') {
            return _templateForListView;
        } else {
            throw 'Upcoming Classes directive: unable to determine template for view: ' + attributes.view;
        }
    }
    
    function controller($scope, UpcomingClassesService, CategoryService) {

        CategoryService.getAll().then(function (cats) {
                cats.unshift({ name: 'All Categories', value: '' });
                $scope.categories = cats;
                $scope.selectedCategory = $scope.categories[0];
        },function () {
                $scope.categories = [{ name: 'Error loading categories', value: '' }];
        });

        UpcomingClassesService.getClasses().then(function(upcomingClasses) {
            console.log('333 ', upcomingClasses);
            $scope.upcomingClasses = upcomingClasses;
        });
        
    }
    
});
