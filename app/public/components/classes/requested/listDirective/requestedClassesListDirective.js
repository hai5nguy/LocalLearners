localLearnersApp.directive('llRequestedClassesList', function() {
    
    const _templateForTileView = 'components/classes/requested/listDirective/requestedTileViewTemplate.html';
    const _templateForListView = 'components/classes/requested/listDirective/requestedListViewTemplate.html';
    
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: determineWhichTemplateToUse,
        controller: controller
    }

    function determineWhichTemplateToUse(element, attributes) {
        if (!attributes.view) throw 'Upcoming Classes List directive needs a view attribute';
        if (attributes.view == 'tile') {
            return _templateForTileView;
        } else if (attributes.view == 'list') {
            return _templateForListView;
        } else {
            throw 'Requested Classes List directive: unable to determine template for view: ' + attributes.view;
        }
    }

    function controller($scope, $rootScope, RequestedClassesService, $q, EVENTS, CategoryService) {
    
        hookupRequestedClassesFiltering();
        
        populateCategories();
        
        getRequestedList().then(function(requestedClasses) {
            createRequestedGroup(requestedClasses);
        }, function (error) {
            console.log('requestedClassesListDirective error: ', error);
        });
        
        function hookupRequestedClassesFiltering() {
            $scope.search = {
                name: ''
            };
            
            $rootScope.$on(EVENTS.topRequestedClassesFilter, function (event, filter) {
                $scope.search.name = filter;
            });
        }
        
        function populateCategories() {
            CategoryService.getAll().then(function (categories) {
                categories.unshift({ name: 'All Categories', value: '' });
                $scope.categories = categories;
                $scope.selectedCategory = $scope.categories[0];
            }, function () {
                $scope.categories = [ { name: 'Error loading categories', value: '' }];
            });
        }
        
        function getRequestedList() {
            return $q(function (resolve, reject) {
                RequestedClassesService.getClasses().then(function(requestedClasses) {
                    $scope.requestedClasses = requestedClasses;
                    resolve(requestedClasses);
                }, function (error) {
                    reject('requestedClassesListDirective error', error);
                });
            });
        }
        
        function createRequestedGroup(requestedClasses) {
            var requestedGroup = _.groupBy(requestedClasses, function (r) { return r.category.name });
    
            _.each(requestedGroup, function(group, i) {
                requestedGroup[i] = _.first(
                    _.sortBy(group, function (r) {
                        return -r.interestedUsers.length;
                    }), 4);
            });
    
            $scope.requestedGroup = requestedGroup;
        }

    }
    
});
