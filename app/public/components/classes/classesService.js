localLearnersApp.factory('ClassesService', function ($http, UserProfile) {
    return {
        getUpcomingClasses: function(callback) {

            $http.get('/upcomingclasses').success(function(classes) {
                callback(classes);
            });

            /*
            var defaultOptions = {
                category: ''
            };
            var settings = _.extend(defaultOptions, options);

            var availableClasses = [
                { name:'Intro to Guitar',         date:'December 18, 2015',  location:'Downtown',        catlink:'music',           catname:'Music',           image:'music.png',           description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur quasi fugiat esse dignissimos deserunt, itaque illo, facilis unde? Voluptatibus quibusdam dolores cum numquam, molestias laboriosam modi. Ad illum, eveniet debitis.' },
                { name:'Advanced CSS Techniques', date:'October 5, 2015',    location:'Fishers',         catlink:'technology',      catname:'Technology',      image:'technology.png',      description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur quasi fugiat esse dignissimos deserunt, itaque illo, facilis unde? Voluptatibus quibusdam dolores cum numquam, molestias laboriosam modi. Ad illum, eveniet debitis.' },
                { name:'Basketweaving',           date:'March 1, 2015',      location:'Carmel',          catlink:'diy',             catname:'DIY',             image:'diy.png',             description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur quasi fugiat esse dignissimos deserunt, itaque illo, facilis unde? Voluptatibus quibusdam dolores cum numquam, molestias laboriosam modi. Ad illum, eveniet debitis.' },
                { name:'Ultimate Frisbee 101',    date:'August 4, 2015',     location:'Downtown',        catlink:'sports',          catname:'Sports',          image:'sports.png',          description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur quasi fugiat esse dignissimos deserunt, itaque illo, facilis unde? Voluptatibus quibusdam dolores cum numquam, molestias laboriosam modi. Ad illum, eveniet debitis.' },
                { name:'Cooking Steaks',          date:'January 21, 2015',   location:'Fountain Square', catlink:'culinary',        catname:'Culinary',        image:'culinary.png',        description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur quasi fugiat esse dignissimos deserunt, itaque illo, facilis unde? Voluptatibus quibusdam dolores cum numquam, molestias laboriosam modi. Ad illum, eveniet debitis.' },
                { name:'Broadway for Dummies',    date:'September 21, 2015', location:'Downtown',        catlink:'performing-arts', catname:'Performing Arts', image:'performing-arts.png', description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur quasi fugiat esse dignissimos deserunt, itaque illo, facilis unde? Voluptatibus quibusdam dolores cum numquam, molestias laboriosam modi. Ad illum, eveniet debitis.' },
                { name:'Taking Care of Cats',     date:'June 28, 2015',      location:'Avon',            catlink:'other',           catname:'Other',           image:'other.png',           description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur quasi fugiat esse dignissimos deserunt, itaque illo, facilis unde? Voluptatibus quibusdam dolores cum numquam, molestias laboriosam modi. Ad illum, eveniet debitis.' },
                { name:'Intro to Piano',          date:'August 5, 2015',     location:'Lawrence',        catlink:'music',           catname:'Music',           image:'music.png',           description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur quasi fugiat esse dignissimos deserunt, itaque illo, facilis unde? Voluptatibus quibusdam dolores cum numquam, molestias laboriosam modi. Ad illum, eveniet debitis.' },
                { name:'Water Aerobics',          date:'October 7, 2015',    location:'Fountain Square', catlink:'fitness',         catname:'Fitness',         image:'fitness.png',         description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur quasi fugiat esse dignissimos deserunt, itaque illo, facilis unde? Voluptatibus quibusdam dolores cum numquam, molestias laboriosam modi. Ad illum, eveniet debitis.' },
                { name:'Fix Your Break Pads',     date:'November 6, 2015',   location:'Greenwood',       catlink:'automotive',      catname:'Automotive',      image:'automotive.png',      description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur quasi fugiat esse dignissimos deserunt, itaque illo, facilis unde? Voluptatibus quibusdam dolores cum numquam, molestias laboriosam modi. Ad illum, eveniet debitis.' },
                { name:'Appreciate Art Better',   date:'February 20, 2015',  location:'Fishers',         catlink:'visual-arts',     catname:'Visual Arts',     image:'visual-arts.png',     description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur quasi fugiat esse dignissimos deserunt, itaque illo, facilis unde? Voluptatibus quibusdam dolores cum numquam, molestias laboriosam modi. Ad illum, eveniet debitis.' },
                { name:'Spanish',                 date:'January 5, 2015',    location:'Carmel',          catlink:'language',        catname:'Language',        image:'language.png',        description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur quasi fugiat esse dignissimos deserunt, itaque illo, facilis unde? Voluptatibus quibusdam dolores cum numquam, molestias laboriosam modi. Ad illum, eveniet debitis.' },
                { name:'French',                  date:'January 5, 2015',    location:'Carmel',          catlink:'language',        catname:'Language',        image:'language.png',        description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur quasi fugiat esse dignissimos deserunt, itaque illo, facilis unde? Voluptatibus quibusdam dolores cum numquam, molestias laboriosam modi. Ad illum, eveniet debitis.' },
                { name:'German',                  date:'January 5, 2015',    location:'Carmel',          catlink:'language',        catname:'Language',        image:'language.png',        description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur quasi fugiat esse dignissimos deserunt, itaque illo, facilis unde? Voluptatibus quibusdam dolores cum numquam, molestias laboriosam modi. Ad illum, eveniet debitis.' },
                { name:'Swedish',                 date:'January 5, 2015',    location:'Carmel',          catlink:'language',        catname:'Language',        image:'language.png',        description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur quasi fugiat esse dignissimos deserunt, itaque illo, facilis unde? Voluptatibus quibusdam dolores cum numquam, molestias laboriosam modi. Ad illum, eveniet debitis.' },
                { name:'English',                 date:'January 5, 2015',    location:'Carmel',          catlink:'language',        catname:'Language',        image:'language.png',        description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur quasi fugiat esse dignissimos deserunt, itaque illo, facilis unde? Voluptatibus quibusdam dolores cum numquam, molestias laboriosam modi. Ad illum, eveniet debitis.' }
            ];

            var filter = settings.category === '' ? {} : { category: settings.category };
            var result = _.where(availableClasses, filter);

            return result;
            */

        },
        postUpcomingClasses: function(upcomingClass, callback) {
            $http.post('/upcomingclasses', upcomingClass);
        },
        getCategories: function(callback) {
            $http.get('/categories')
                .success(function(categories) {
//                    categories.sort(function (a, b) {
//                        if (a.toLowerCase() < b.toLowerCase()) return -1;
//                        if (a.toLowerCase() > b.toLowerCase()) return 1;
//                        return 0;
//                    });
                    categories = _.sortBy(categories, "name");

                    categories.unshift({ name: 'All Categories', value: '' });
                    callback(categories);
                });
        }
    }
})