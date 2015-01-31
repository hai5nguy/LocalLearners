localLearnersApp.controller('MainCtrl', function($scope, ClassesService) {

//	$scope.availClasses = [
//        {name:'Intro to Guitar',date:'December 18, 2015',location:'Downtown',category:'music',image:'music.png'},
//        {name:'Advanced CSS Techniques',date:'October 5, 2015',location:'Fishers',category:'technology',image:'technology.png'},
//        {name:'Basketweaving',date:'March 1, 2015',location:'Carmel',category:'DIY',image:'diy.png'},
//        {name:'Ultimate Frisbee 101',date:'August 4, 2015',location:'Downtown',category:'sports',image:'sports.png'},
//        {name:'Cooking Steaks',date:'January 21, 2015',location:'Fountain Square',category:'culinary',image:'culinary.png'},
//        {name:'Broadway for Dummies',date:'September 21, 2015',location:'Downtown',category:'performing-arts',image:'performing-arts.png'},
//        {name:'Taking Care of Cats',date:'June 28, 2015',location:'Avon',category:'other',image:'other.png'}
//        ];

    ClassesService.postUpcomingClasses({ name: 'test class name 2', category: 'category2' });



    ClassesService.getUpcomingClasses(function(classes) {
        $scope.availClasses = classes;
    })

    console.log('availclasses', $scope.availClasses);

    $scope.getClassInfo = function(availClass) {
        $scope.availClass = availClass; // binds clicked class to scope
    };

    $scope.reqClasses = [
        {name:'Intro to Photoshop',category:'technology',requests:5},
        {name:'Intermediate Guitar',category:'music',requests:34},
        {name:'Using a Pottery Wheel',category:'visual-arts',requests:53},
        {name:'Advanced Bootstrap 3',category:'technology',requests:42},
        {name:'Changing Your Breakpads',category:'diy',requests:9},
        {name:'Retirement and 401K',category:'business',requests:1},
        {name:'Advanced Pillowforts',category:'other',requests:10},
        {name:'Designing for the Blind',category:'visual-arts',requests:26},
        {name:'Roth IRAs',category:'business',requests:17},
        {name:'Intro to Bird Watching',category:'other',requests:4},
        {name:'Film Appreciation',category:'visual-arts',requests:7},
        {name:'Tornado Chasing',category:'other',requests:0},
        {name:'Archery',category:'sports',requests:4},
        {name:'Special Effects',category:'technology',requests:3},
        {name:'Planning a Birthday Party',category:'other',requests:15},
    ];

});