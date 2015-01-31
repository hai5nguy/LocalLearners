localLearnerApp
    .controller('IndexCtrl', function($scope, MeetupProfileSvc) {
        //console.log('accesstoken', MeetupProfile.accessToken);
        $scope.appSettings = {
            url: {
                header: 'components/header/header.html',
                footer: 'components/footer/footer.html'
            }
        }
        $scope.userAuthenticated =  MeetupProfileSvc.authenticated;

//        $scope.test = function() { return MeetupProfile.accessToken; }

//        alert(MeetupProfile.accessToken);
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