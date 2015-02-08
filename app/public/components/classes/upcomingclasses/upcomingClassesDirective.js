localLearnersApp.directive('llUpcomingClasses', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/classes/upcomingclasses/upcomingClassesTemplate.html',
        controller: function($scope, ClassesService) {
            ClassesService.getCategories(function(categories) {
                $scope.categories = categories;
                $scope.selectedCategory = $scope.categories[0];
            });


//            $scope.availClasses = [
//                {name:'Intro to Guitar',date:'December 18, 2015',location:'Downtown',category:'music',image:'music.png'},
//                {name:'Advanced CSS Techniques',date:'October 5, 2015',location:'Fishers',category:'technology',image:'technology.png'},
//                {name:'Basketweaving',date:'March 1, 2015',location:'Carmel',category:'DIY',image:'diy.png'},
//                {name:'Ultimate Frisbee 101',date:'August 4, 2015',location:'Downtown',category:'sports',image:'sports.png'},
//                {name:'Cooking Steaks',date:'January 21, 2015',location:'Fountain Square',category:'culinary',image:'culinary.png'},
//                {name:'Broadway for Dummies',date:'September 21, 2015',location:'Downtown',category:'performing-arts',image:'performing-arts.png'},
//                {name:'Taking Care of Cats',date:'June 28, 2015',location:'Avon',category:'other',image:'other.png'}
//            ];

            ClassesService.getUpcomingClasses(function(upcomingClasses) {
                console.log('upcoming', upcomingClasses);
                $scope.availClasses = upcomingClasses;
            });

        }
    }
});