var Q               = require(LL_NODE_MODULES_DIR + 'q');

var Database        = require(LL_MODULES_DIR + 'Database.js');
var MeetupApi       = require(LL_MODULES_DIR + 'MeetupApi.js');
var Authentication  = require(LL_MODULES_DIR + 'Authentication.js');



var meetupAdministrator = require('../meetup-administrator.js');


module.exports = function () {
	var app = THE_APP;
    app.get('/echo', Authentication.ensureAuthenticated, function (req, res, next) {
        res.json(req.session);
    });

    app.get('/seedfakeupcomingclasses', function (req, res) {
        
        db.Category.getAll().then(function (categories) {
            for (var i = 0; i < 100; i++) {

                var categoryIndex = i % categories.length;

                db.setUpcomingClasses({
                    eventId: (1000 + i).toString(),
                    category: {
                        name: categories[categoryIndex].name,
                        value: categories[categoryIndex].value,
                        imageUrl: categories[categoryIndex].imageUrl
                    }
                });
            }
        });
        res.send('fake classes loaded');
    });


    app.get('/seedcategories', function (req, res) {
        var imgUrlRoot = 'img/class/';
        var defaultCategories = [
            { name: 'Technology', value: 'technology', imageUrl: imgUrlRoot + 'technology.png' },
            { name: 'Automotive', value: 'automotive', imageUrl: imgUrlRoot + 'automotive.png' },
            { name: 'Culinary', value: 'culinary', imageUrl: imgUrlRoot + 'culinary.png' },
            { name: 'DIY', value: 'diy', imageUrl: imgUrlRoot + 'diy.png' },
            { name: 'Fitness', value: 'fitness', imageUrl: imgUrlRoot + 'fitness.png' },
            { name: 'Games', value: 'games', imageUrl: imgUrlRoot + 'games.png' },
            { name: 'History', value: 'history', imageUrl: imgUrlRoot + 'history.png' },
            { name: 'Language', value: 'language', imageUrl: imgUrlRoot + 'language.png' },
            { name: 'Literature', value: 'literature', imageUrl: imgUrlRoot + 'literature.png' },
            { name: 'Music', value: 'music', imageUrl: imgUrlRoot + 'music.png' },
            { name: 'Other', value: 'other', imageUrl: imgUrlRoot + 'other.png' },
            { name: 'Performing Arts', value: 'performing-arts', imageUrl: imgUrlRoot + 'performing-arts.png' },
            { name: 'Science', value: 'science', imageUrl: imgUrlRoot + 'science.png' },
            { name: 'Sports', value: 'sports', imageUrl: imgUrlRoot + 'sports.png' },
            { name: 'Visual Arts', value: 'visual-arts', imageUrl: imgUrlRoot + 'visual-arts.png' }
        ];
        
        //db.insertCategories(defaultCategories);
        
        for (var i = 0; i < defaultCategories.length; i++ ) {
            db.Category.add(defaultCategories[i]);
        }
        
        res.send('categories seeded');;
    });


    app.get('/seedfakemeetupevents', function (req, res) {
        var fakeEvents = [];

        for (var i = 0; i < 100; i++) {
            var id = (1000 + i).toString();
            fakeEvents.push({
                visibility: 'public',
                status: 'upcoming',
                maybe_rsvp_count: 0,
                utc_offset: -14400000,
                id: id,
                time: 1427860800000,
                announced: false,
                waitlist_count: 0,
                created: 1422652477016,
                yes_rsvp_count: 1,
                updated: 1422652477016,
                event_url: 'http://www.fakemeetup.com/fakeurl/',
                headcount: 0,
                name: 'class name id ' + id,
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
            });
        }
        db.insertFakeEvents(fakeEvents);
        res.send('fake meetup events seeded');
    });

    app.get('/dbtest', function (req, res) {
        //res.send(500, { blah: 'blah blah' });//.end(); json({blah: 'blah'});
        db.upsertUser({ meetupId: 85189222 }, { name: 'test 4' });
    });

    app.get('/changeuserrole', function (req, res) {
    	var context = new CONTEXT();
        context.Authentication.user = req.user;
        
        
        MeetupApi.Profile.promoteUser(context)().then(function () {
            res.send('success');
        }, function () {
            res.send('fail');
        });
        
    });

    app.get('/testadmin', function (req, res) {
        meetupAdministrator.getAdministratorAccessToken()
            .then(function(t) {
                console.log('token ', t)
            });
        res.send('done');
    });


}


