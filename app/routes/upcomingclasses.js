var meetupApi = require('../meetup-api.js');

module.exports = function (app) {

    app.get('/upcomingclasses', function (req, res) {

        meetupApi.getEvents(req, res, function(data) {

            console.log('data ', data);
            var rawEvents = data.results;
            var events = [];
            for (var i = 0; i < rawEvents.length; i++) {
                events.push({
                    name: rawEvents[i].name,
                    category: 'Technology'
                });
            }
            console.log('events ', events);

            res.json(events);

        });

    });

    app.get('/upcomingclasses/:id', function (req, res) {

        res.json({ upcomingclass: 'upcoming class with id ' + req.params.id });

    });
}