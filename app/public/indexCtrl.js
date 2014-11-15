localLearnerApp
    .controller('IndexCtrl', function($scope) {
        $scope.appSettings = {
            url: {
                header: 'components/header/header.html',
                footer: 'components/footer/footer.html'
            }
        }
    })
    .directive('includeReplace', function () {
        return {
            require: 'ngInclude',
            restrict: 'A', /* optional */
            link: function (scope, el, attrs) {
                el.replaceWith(el.children());
            }
        };
    });