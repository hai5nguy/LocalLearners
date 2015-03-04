//var Q = require('../../node_modules/q');
//var meetupApi = require('../meetup-api.js');
var db = require('../db.js')(THE_APP);


module.exports = function (app) {
    app.get('/fakemeetupapi/events', function (req, res) {
        db.getFakeEvents(function(events) {
            //must be sent back like this because node-rest-client is a little bitch
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify({ results: events }));
        });
    });

    app.post('/fakemeetupapi/event', function (req, res) {

        var id = getRandomInt(1e3, 1e4).toString();

        console.log()

        var fakeEvent = {
            visibility: 'public',
            status: 'upcoming',
            maybe_rsvp_count: 0,
            event_hosts: [{
                member_name: 'fake user',
                member_id: 'fake mid'
            }],
            utc_offset: -14400000,
            id: id,
            time: req.query.time,
            announced: false,
            waitlist_count: 0,
            created: new Date().getTime(),
            yes_rsvp_count: 1,
            updated: new Date().getTime(),
            event_url: 'http://www.fakemeetup.com/LocalLearners/events/' + id + '/',
            headcount: 0,
            name: req.query.name + ' (id: ' + id + ')',
            group: {
                id: 18049722,
                created: 1415053890000,
                group_lat: 39.77000045776367,
                name: 'Local Learners',
                group_lon: -86.16000366210938,
                join_mode: 'open',
                urlname: 'LocalLearners',
                who: 'Learners'
            }
        }

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
