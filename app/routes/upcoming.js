var Q               = require(LL_NODE_MODULES_DIR + 'q');
var _               = require(LL_NODE_MODULES_DIR + 'underscore');
var uuid            = require(LL_NODE_MODULES_DIR + 'node-uuid');

//var Database        = require(LL_MODULES_DIR + 'Database.js');
var Authentication  = require(LL_MODULES_DIR + 'Authentication.js');
// var MeetupApi       = require(LL_MODULES_DIR + 'MeetupApi.js');
var UpcomingClass   = require(LL_MODULES_DIR + 'UpcomingClass.js');


module.exports = (function () {
    var app = THE_APP;

    app.get('/api/upcoming', function (req, res) {

        var upcomingClasses = new UpcomingClass.Collection({
            req: req
        });

        upcomingClasses.load().then(function () {
            res.json(upcomingClasses.get());
        }, function () {
            res.status(500).send(upcomingClasses.error);
        });

    });


    app.get('/api/upcoming/:id', function (req, res) {
        
        Q.fcall(getUpcomingClass(req.params.id))
            .then(populateMeetupEvent())
            .then(populateRSVPs())
            .then(function (upcomingClass) {
                res.json(upcomingClass);
            })
            .catch(function (error) {
                res.status(500).send({error: error});  
            })
            .done();
        
    });

    //app.post('/api/upcoming', Authentication.ensureAuthenticated, function (req, res) {
    app.post('/api/upcoming', function (req, res) {
        
        var upcomingClass = new UpcomingClass.Item({
            req: req
        });

        var newClassInfo = {
            category: req.body.category
        };

        var newMeetupEvent = {
            name: req.body.name,
            time: req.body.time
        };

        d(newClassInfo);
        
        upcomingClass.allocate({ newClassInfo: newClassInfo }).then(function () {
            res.json(upcomingClass.get());
            upcomingClass.build({ newMeetupEvent: newMeetupEvent });
        }, function () {
            res.status(500).send(upcomingClass.error);
        });
       
        /*
        
        var context = new CONTEXT();
        context.set('authentication.user', req.user);
        
        context.set('upcomingclass.new', {
            category: req.body.category,
            name: req.body.name,
            teachers: [ req.user._id ],
            time: req.body.time
        });
        
        Q.fcall(UpcomingClass.allocateNew(context))
            .then(function () {
                res.json(context.get('upcomingclass.allocated'));
                UpcomingClass.buildNew(context)().then(function () {
                    t("buildnew success");
                    //success
                }, function () {
                    //fail, bad bad fail
                    t('buildNew failed');
                    d(context.get('error'));
                });
            })
            .catch(function () {
                res.status(500).send(context.get('error'));
            })
            .done();
            
            */
    });

    app.post('/api/upcoming/:classId/setrsvp', function (req, res) {
        
        var c = req.params.classId;
        var a = req.body.isAttending;
        
        Q.fcall(rsvpOnMeetup(req, { classId: c, isAttending: a }))
            .then(updateStudentsAttending(req, res))
            .then(function (upcomingClass) {
                res.json({ status: 'success', upcomingClass: upcomingClass });
            })
            .catch(function (error) {
                res.status(500).send({ error: error });
            })
            .done();
        
        /*
        var setRSVP = Database.Upcoming.RSVP.set(req.params.id, req.user._id, req.body.isAttending);
        setRSVP.then(function(upcomingClass) {
            res.json({ status: 'success', requestedClass: upcomingClass })
        }, function (error) {
            res.status(500).send({ error: error });
        });
        
        */
        
        
    });
    
})();


function beginClassCreation(newClass, req) {
    var args = { session: req.session, user: req.user };
    var meetupApi = new MeetupApi(args);
    
    //meetupApi.post(newClass).then() {
    //    Database.Upcoming.
    //}
}
function validateUpcomingClass(upcomingClass) {
    return function() {
        
        var defer = Q.defer();
        if ( IsPopulatedString(upcomingClass.name) &&
            IsPopulatedString(upcomingClass.category) &&
            IsPopulatedNumber(upcomingClass.time)
        ) {
            defer.resolve(true);
        } else {
            defer.reject('Upcoming class invalid');
        }
        return defer.promise;
    }
}

function postToMeetup(req, res, upcomingClass) {
    return function() {
        return Q.Promise(function (resolve, reject, notify) {
            var eventToPost = {
                name: upcomingClass.name,
                time: upcomingClass.time
            };

            meetupApi.Event.post(req, res, eventToPost).then(function (createdEvent) {
                debug(FUNCTIONALITY.api_post_upcoming, 'postToMeetup', { createdEvent: createdEvent } );
                resolve(createdEvent);
            }, function (error) {
                debug(FUNCTIONALITY.api_post_upcoming, 'postToMeetup', { error: error } );
                reject(error);
            });
        });
    }
}

function savePostedClassToDB(upcomingClass) {
    return function (createdEvent) {
        return Q.Promise(function (resolve, reject, notify) {
            var classToSave = {
                category: upcomingClass.category,
                meetup: {
                    event: {
                        id: createdEvent.id,
                        name: createdEvent.name
                    }
                },
                teachers: upcomingClass.teachers
            };
            
            Database.Upcoming.add(classToSave).then(function (savedClass) {
                resolve(savedClass)
            }, function (err) {
                reject(err);
            });
        });
    }
}

function deleteAssocatedRequestedClass(upcomingClass) {
    return function(savedClass) {
        return Q.Promise(function (resolve, reject, notify) {
            if (!upcomingClass.associatedRequestedClassId) {
                resolve(savedClass);
            } else {
                Database.Requested.remove({ _id: upcomingClass.associatedRequestedClassId }).then(resolve, reject);
            }
        });
    }
}

/////////////////////////////////////////////////////////////////////

function getUpcomingClass(id) {
    return function() {
        return Database.Upcoming.get(id);
    }
}

function populateMeetupEvent() {
    return function(upcomingClass) {
        debug(FUNCTIONALITY.api_get_upcoming_by_id, 'populateMeetupEvent', { upcomingClass: upcomingClass });
        return Q.Promise(function (resolve, reject, notify) {
            meetupApi.Event.get(upcomingClass.meetup.event.id).then(function (event) {
                upcomingClass.meetup.event = event;
                resolve(upcomingClass)
            }, reject)
        });
    }
}

function populateRSVPs() {
    return function (upcomingClass) {
        debug(FUNCTIONALITY.api_get_upcoming_by_id, 'populateRSVPs', { upcomingClass: upcomingClass });
        return Q.Promise(function (resolve, reject, notify) {
            meetupApi.RSVP.get(upcomingClass.meetup.event.id).then(function (rsvps) {
                upcomingClass.meetup.rsvpList = rsvps;
            }, reject)
        });

    }
}

/////////////////////////////////////////////////////////////////////

function rsvpOnMeetup(req, args) {
    return function() {
        return Q.Promise(function (resolve, reject, notify) {
            Database.Upcoming.get(args.classId).then(function(upcomingClass) {
                
                var e = upcomingClass.meetupEvent.id, e = args.isAttending;
                meetupApi.RSVP.update(req, { eventId: e, isAttending: a }).then(function () {
                    reject('testing');
                }, reject);
                
            }, reject);
        });
    }
}

function updateStudentsAttending() {
    return function() {
        return Q.Promise(function (resolve, reject, notify) {
            reject("testing from updatestudentsattending");
        });
    }
}
///////////////////////////////////



