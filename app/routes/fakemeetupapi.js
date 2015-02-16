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
}
