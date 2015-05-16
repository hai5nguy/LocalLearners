var Q       = require(LL_NODE_MODULES_DIR + 'q');
var _       = require(LL_NODE_MODULES_DIR + 'underscore');
var uuid    = require(LL_NODE_MODULES_DIR + 'node-uuid');

//var Database = require('../Database.js');
var MeetupApi       = require(LL_MODULES_DIR + 'MeetupApi.js');
var UpcomingClass   = require(LL_MODULES_DIR + 'UpcomingClass.js');


module.exports = function (app) {
    

    app.get('/api/upcoming', function (req, res) {
        
        var args = { session: req.session };
        
        var Database = Database(args);
        
        Database.Upcoming.getAll().then(function (upcomingClasses) {
            res.json(upcomingClasses);
        }, function (error) {
            res.status(500).send({ error: error });
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
            });
        
    });

    app.post('/api/upcoming', function (req, res) {
        
        var context = {
            error: null,
            upcomingClass: {
                name: req.body.name,
                category: req.body.category,
                time: req.body.time,
                valid: undefined,
                invalidReason: '',
                error: undefined
            },
            user: req.user
        };
        
        debug(FUNCTIONALITY.api_post_upcoming, { context: context });
        
        
        Q.fcall(UpcomingClass.invoke('allocateNew', context))
            .then(function (context) {
                res.json({ upcomingClass: context.upcomingClass });
                UpcomingClass.invoke('buildNew', context)();
            })
            .catch(function (context) {
                res.status(500).send({ context: context });
            })
            .done();
        
        
        
        //
        //newClass.validate().then(function () {
        //    res.json({ status: 'initialzing', postingId: newClass.postingId })
        //}, function (error) {
        //    debug(FUNCTIONALITY.api_post_upcoming, 'error', error);
        //    res.status(500).send({ error: error });
        //});
        
        /*
        Q.fcall(validateUpcomingClass(newClass))
            .then(postToMeetup(req, res, upcomingClass))
            .then(savePostedClassToDB(upcomingClass))
            .then(deleteAssocatedRequestedClass(upcomingClass))
            .then(function (createdUpcomingClass) {
                debug(FUNCTIONALITY.api_post_upcoming, { createdUpcomingClass: createdUpcomingClass.toObject() } );
                res.json({status: 'success', createdUpcomingClass: createdUpcomingClass});
            })
            .catch(function (error) {
                debug(FUNCTIONALITY.api_post_upcoming, 'error', error);
                res.status(500).send({error: error});
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
    
}


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
            IsPopulatedString(upcomingClass.category_id) &&
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
                category: upcomingClass.category_id,
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



