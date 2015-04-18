var Q = require('../../node_modules/q');
var _ = require('../../node_modules/underscore');
var meetupApi = require('../meetup-api.js')(THE_APP);
var db = require('../db.js')(THE_APP);

module.exports = function (app) {

    app.get('/api/upcoming', function (req, res) {
        
        db.Upcoming.getAll().then(function (upcomingClasses) {
            res.json(upcomingClasses);
        }, function (error) {
            res.status(500).send({ error: error });
        });
        
    });

    app.get('/api/upcoming/:id', function (req, res) {
        
        
        Q.fcall(getUpcomingClass(req.params.id))
            .then(function (upcomingClass) {
                res.json(upcomingClass);
            })
            .catch(function (error) {
                res.status(500).send({error: error});  
            });
    });

    app.post('/api/upcoming', function (req, res) {
        
        var upcomingClass = {
            name: req.body.name,
            category: req.body.category,
            time: new Date(req.body.time).getTime(),
            associatedRequestedClassId: req.body.associatedRequestedClassId
        };
        
        debug(FUNCTIONALITY.api_post_upcoming, 'incoming upcomingClass', upcomingClass);

        Q.fcall(validateUpcomingClass(upcomingClass))
            .then(postToMeetup(req, res, upcomingClass))
            .then(savePostedClassToDB(upcomingClass))
            .then(deleteAssocatedRequestedClass(upcomingClass))
            .then(function (createdUpcomingClass) {
                debug(FUNCTIONALITY.api_post_upcoming, 'createdUpcomingClass', createdUpcomingClass);
                res.json({status: 'success', createdUpcomingClass: createdUpcomingClass});
            })
            .catch(function (error) {
                debug(FUNCTIONALITY.api_post_upcoming, 'error', error);
                res.status(500).send({error: error});
            })
            .done();
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
        var setRSVP = db.Upcoming.RSVP.set(req.params.id, req.user._id, req.body.isAttending);
        setRSVP.then(function(upcomingClass) {
            res.json({ status: 'success', requestedClass: upcomingClass })
        }, function (error) {
            res.status(500).send({ error: error });
        });
        
        */
    });
    
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
                debug(FUNCTIONALITY.api_post_upcoming, 'postToMeetup createdEvent', createdEvent, typeof createdEvent);
                resolve(createdEvent);
            }, function (error) {
                debug(FUNCTIONALITY.api_post_upcoming, 'postToMeetup error', error);
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
                meetupEvent: createdEvent
            };
            db.Upcoming.add(classToSave).then(function (savedClass) {
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
            if (!upcomingClass.associatedRequestedClassId) resolve(savedClass);
            
            db.Requested.remove({ _id: upcomingClass.associatedRequestedClassId }).then(function () {
                resolve(savedClass);
            }, function (err) {
                reject(err);
            });
        });
    }
}

function getUpcomingClass(id) {
    return function() {
        return Q.Promise(function (resolve, reject, notify) {
            db.Upcoming.get(id).then(resolve, reject);
        });
    }
}

///////////////////////////////////

function rsvpOnMeetup(req, args) {
    return function() {
        return Q.Promise(function (resolve, reject, notify) {
            db.Upcoming.get(args.classId).then(function(upcomingClass) {
                
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


