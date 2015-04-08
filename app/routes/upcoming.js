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

        Q.fcall(validateUpcomingClass(upcomingClass))
            .then(postToMeetup(req, res, upcomingClass))
            .then(savePostedClassToDB(upcomingClass))
            .then(deleteAssocatedRequestedClass(upcomingClass))
            .then(function (createdUpcomingClass) {
                //console.log('createdupcomingclass: ', JSON.stringify(createdUpcomingClass));
                res.json({status: 'success', createdUpcomingClass: createdUpcomingClass});
            })
            .catch(function (error) {
                console.log('error : ', error);
                res.status(500).send({error: error});
            })
            .done();
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

            meetupApi.Event.post(req, res, eventToPost).then(function (r) {
                var response = JSON.parse(r);
                if (response && response.status === 'success') {
                    resolve(response.createdEvent);
                } else {
                    reject("Unable to post class to Meetup");
                }
            }, function (err) {
                reject(err);
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

function getUpcomingClasses() {
    return function () {
        return Q.Promise(function (resolve, reject, notify) {
            db.Upcoming.getAll().then(resolve, reject);
        });
    }
}



function mergeWithMeetupEvents() {
    return function (upcomingClasses) {
        return Q.Promise(function (resolve, reject, notify) {
            
            meetupApi.Event.getAll().then(function (events) {
                
                _.each(upcomingClasses, function(upcomingClass) {
                    var matchingEvent = _.findWhere(events, { id: upcomingClass.meetupEvent.id });
                    
                    if (matchingEvent) {
                        matchingEvent.meetupEvent = matchingEvent;
                    }
                });
                
                db.Upcoming.updateAll(upcomingClasses).then(function(a) {
                    console.log('111 ', a)
                    resolve(a);
                }, function (err) {
                    reject(err);
                });
                
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