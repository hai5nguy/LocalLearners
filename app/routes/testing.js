var Q = require('../../node_modules/q');
var meetupApi = require('../meetup-api.js');
var db = require('../db.js');

module.exports = function (app) {

    app.get('/seedfakeupcomingclasses', function(req, res) {

        db.setUpcomingClasses({ eventId: 'eventid1', category: 'Technology' });
        db.setUpcomingClasses({ eventId: 'eventid2', category: 'Technology' });
        db.setUpcomingClasses({ eventId: 'eventid3', category: 'Technology' });
        db.setUpcomingClasses({ eventId: 'eventid4', category: 'Technology' });
        db.setUpcomingClasses({ eventId: 'eventid5', category: 'Technology' });
        db.setUpcomingClasses({ eventId: 'eventid6', category: 'Music' });
        db.setUpcomingClasses({ eventId: 'eventid7', category: 'Music' });
        db.setUpcomingClasses({ eventId: 'eventid8', category: 'Music' });
        db.setUpcomingClasses({ eventId: 'eventid9', category: 'Music' });
        db.setUpcomingClasses({ eventId: 'eventid10', category: 'Music' });
        db.setUpcomingClasses({ eventId: 'eventid11', category: 'Visual Arts' });
        db.setUpcomingClasses({ eventId: 'eventid12', category: 'Visual Arts' });
        db.setUpcomingClasses({ eventId: 'eventid13', category: 'Visual Arts' });
        db.setUpcomingClasses({ eventId: 'eventid14', category: 'Visual Arts' });
        db.setUpcomingClasses({ eventId: 'eventid15', category: 'Visual Arts' });
        db.setUpcomingClasses({ eventId: 'eventid16', category: 'DIY' });
        db.setUpcomingClasses({ eventId: 'eventid17', category: 'DIY' });
        db.setUpcomingClasses({ eventId: 'eventid18', category: 'Business' });
        db.setUpcomingClasses({ eventId: 'eventid19', category: 'Business' });
        db.setUpcomingClasses({ eventId: 'eventid20', category: 'Other' });

        res.send('fake classes loaded');
    });


    app.get('/seedcategories', function(req, res) {
        db.insertCategories(['Technology', 'Music', 'Visual Arts', 'DIY', 'lowercase long category name', 'Business', 'Other']);
        res.send('categories seeded');
    });




}


//create list of class