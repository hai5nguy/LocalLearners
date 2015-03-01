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
            return res.json({ error: 'Upcoming Class invalid' });
        }

        var eventToPost = {
            name: upcomingClass.name,
            time: upcomingClass.time
        }

        meetupApi.postEvent(req, res, eventToPost).then(
            function (r) {
                var response = JSON.parse(r);
                if (response && response.status === 'success') {
                    var createdEvent = response.createdEvent;

                    var categoryQuery = { name: upcomingClass.category };
                    saveCreatedEventToDB(createdEvent, categoryQuery).then(
                        function(savedEvent) {
                            res.json(savedEvent);
                        },
                        function (err) {
                            //todo: handle error
                        }
                    );
                } else {
                    res.json({err: r}); //todo: 500
                }
            },
            function (err) {
                //TODO: 500
                res.json({err: err});
            }
        );

    });
}

function saveCreatedEventToDB(eventToSave, categoryQuery) {
    var defer = Q.defer();
    db.getCategory(categoryQuery)
    .then(
        function (category) {
            var eventToSave = {
                eventId: eventToSave.id,
                category: category
            };
            return db.setUpcomingClasses(eventToSave);
        }
    )
    .then(
        function (savedEvent) {
            defer.resolve(savedEvent);
        },
        function (err) {
            //todo: handle error
        }
    );
    return defer.promise;
}

function isUpcomingClassValid(upcomingClass) {
    return (
        IsPopulatedString(upcomingClass.name) &&
        IsPopulatedString(upcomingClass.category) &&
        IsPopulatedNumber(upcomingClass.time)
    )
}

