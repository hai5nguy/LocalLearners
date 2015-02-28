//var Q = require('../../node_modules/q');
//var meetupApi = require('../meetup-api.js');
var db = require('../db.js');

module.exports = function (app) {
    app.get('/fakemeetupapi/events', function (req, res) {
        db.getFakeEvents(function(events) {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify({ results: events }));
        });
    });

    app.post('/fakemeetupapi/event', function (req, res) {
        var fakeEvent = {
            name: req.body.name
        };
        db.addFakeEvent(fakeEvent).then(function(createdEvent) {
            res.json({
                status: 'success',
                createdEvent: createdEvent
            });
        }, function (err) {
            //TODO: error handling
        });
    });
}
