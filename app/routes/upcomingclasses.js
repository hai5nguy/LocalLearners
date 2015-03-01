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
                });
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
            serverError(res, { error: 'Upcoming Class invalid' });
        }

        var eventToPost = {
            name: upcomingClass.name,
            time: upcomingClass.time
        }

        var createdEvent;
        meetupApi.postEvent(req, res, eventToPost)
        .then(
            function (r) {
                var response = JSON.parse(r);
                if (response && response.status === 'success') {
                    createdEvent = response.createdEvent;
                } else {
                    serverError(res, r);
                }
            },
            function (err) {
                serverError(res, err);
            }
        ).then(
            function () {
                var categoryQuery = { name: upcomingClass.category };
                return db.getCategory(categoryQuery);
            }
        ).then(
            function (category) {
                var eventToSave = {
                    eventId: createdEvent.id,
                    category: category
                };
                return db.setUpcomingClasses(eventToSave);
            },
            function (err) {
                serverError(res, err);
            }
        ).then(
            function (savedEvent) {
                res.json({ status: 'success', savedClass: savedEvent });
            },
            function (err) {
                serverError(res, err);
            }
        )
    });
}

function isUpcomingClassValid(upcomingClass) {
    return (
        IsPopulatedString(upcomingClass.name) &&
        IsPopulatedString(upcomingClass.category) &&
        IsPopulatedNumber(upcomingClass.time)
    )
}

function serverError(res, err) {
    res.send(500, { error: err });
}