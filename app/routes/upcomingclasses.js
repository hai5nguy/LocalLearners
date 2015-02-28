var Q = require('../../node_modules/q');
var meetupApi = require('../meetup-api.js')(THE_APP);
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
            time: new Date(req.body.time).getTime()
        };

        if (!isUpcomingClassValid(upcomingClass)) {
            //TODO: should send back 500
            return req.json({ error: 'Upcoming Class invalid' });
        }

        var eventToPost = {
            name: upcomingClass.name,
            time: upcomingClass.time
        }

        meetupApi.postEvent(req, res, eventToPost).then(
            function (eventReturned) {
                var eventToSave = {
                    eventId: eventReturned.id,
                    category: upcomingClass.category
                };
                db.setUpcomingClasses(eventToSave);

                res.json(eventReturned);
            },
            function (err) {
                //TODO: 500
                res.json({err: err});
            }
        );

    });
}

function isUpcomingClassValid(upcomingClass) {
    return (
        IsPopulatedString(upcomingClass.name) &&
        IsPopulatedString(upcomingClass.category) &&
        IsPopulatedNumber(upcomingClass.time)
    )
}

