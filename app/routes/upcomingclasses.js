var Q = require('../../node_modules/q');
var meetupApi = require('../meetup-api.js');
var db = require('../db.js');

module.exports = function (app) {

    app.get('/upcomingclasses', function (req, res) {

        meetupApi.getEvents(req, res)
            .then(function(events) {
                return db.addCategoriesToEvents(events);
            })
            .then(function (eventsWithCategories) {
//                console.log('eventsWithCategories ', eventsWithCategories);
                res.json(eventsWithCategories);
            },
            function() {
//                console.log('error getting upcoming classes');
                res.json({
                    error: 'Can not retrieve classes'
                })
            });
    });

    app.get('/upcomingclasses/:id', function (req, res) {

        res.json({ upcomingclass: 'upcoming class with id ' + req.params.id });

    });

    app.post('/upcomingclasses', function(req, res) {


        //post to meetup



        //get eventid

        //store eventid and category

        var evensdft = {
            name: 'hai test 4',
            time: new Date(2014, 03, 01).getTime()
        }

        meetupApi.postEvent(req, res, event).then(function (result) {
            console.log('post upcomingclass ', result);
        });

        console.log('post upcomingclass ', req.body);
    });
}
