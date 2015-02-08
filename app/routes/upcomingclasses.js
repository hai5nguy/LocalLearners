var Q = require('../../node_modules/q');
var meetupApi = require('../meetup-api.js');
var db = require('../db.js');

module.exports = function (app) {

    app.get('/upcomingclasses', function (req, res) {



        getFakeUpcomingClasses(function(fakeUpcomingClasses) {
            res.json(fakeUpcomingClasses);
        });



//        meetupApi.getEvents(req, res)
//            .then(function(events) {
//                return db.addCategoriesToEvents(events);
//            })
//            .then(function (eventsWithCategories) {
//                console.log('eventsWithCategories ', eventsWithCategories);
//                res.json(eventsWithCategories);
//            },
//            function() {
////                console.log('error getting upcoming classes');
//                res.json({
//                    error: 'Can not retrieve classes'
//                })
//            });

    });

    app.get('/upcomingclasses/:id', function (req, res) {
        //TODO: implement this
        res.json({ upcomingclass: 'upcoming class with id ' + req.params.id });

    });

    app.post('/upcomingclasses', function(req, res) {

        var upcomingClass = {
            name: req.body.name,
            category: req.body.category,
            time: new Date(2015, 03, 01).getTime()
        };

        if (!isUpcomingClassValid(upcomingClass)) {
            return req.json({ error: 'Upcoming Class invalid' });
        }

        var eventToPost = {
            name: upcomingClass.name,
            time: upcomingClass.time
        }

        meetupApi.postEvent(req, res, eventToPost).then(function (eventReturned) {

            var eventToSave = {
                eventId: eventReturned.id,
                category: upcomingClass.category
            };

            db.setUpcomingClasses(eventToSave);
        });

    });
}

function isUpcomingClassValid(upcomingClass) {
    if ( !upcomingClass.name || upcomingClass.name === '' ) return false;
    if ( !upcomingClass.category || upcomingClass.category === '' ) return false;
    if ( !upcomingClass.time ) return false;
    return true;
}

function getFakeUpcomingClasses(callback) {
    db.getCategories(function (categories) {
        var classes = [];
        for (var i = 0; i < 50; i++) {
            classes.push({
                eventId: 'xxx' + i,
                name: 'class name with id xxx' + i,
                category: categories[ i % 15 ]
            });
        }
        callback(classes);
    });



}