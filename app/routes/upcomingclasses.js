var Q = require('../../node_modules/q');
var meetupApi = require('../meetup-api.js')(APP);
var db = require('../db.js');

module.exports = function (app) {

    app.get('/upcomingclasses', function (req, res) {
        meetupApi.getEvents(req, res)
            .then(function(events) {
                return db.addCategoriesToEvents(events);
            })
            .then(function (eventsWithCategories) {
//               console.log('eventsWithCategories ', eventsWithCategories.length);
                res.json(eventsWithCategories);
            },
            function() {
                res.json({
                    error: 'Can not retrieve classes'
                })
            });

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