var Q = require('../../node_modules/q');
var _ = require('../../node_modules/underscore');
var meetupApi = require('../meetup-api.js')(THE_APP);
var db = require('../db.js')(THE_APP);

module.exports = function (app) {

    app.get('/api/upcoming', function (req, res) {

        Q.fcall(getMeetupEvents(req, res))
            .then(mergeWithUpcomingClasses())
            .then(function (upcomingClasses) {
                res.json(upcomingClasses);
            })
            .catch(function (error) {
                res.status(500).send({error: error});
            });
    });

    app.get('/api/upcoming/:id', function (req, res) {
        
        Q.fcall(getMeetupEvent(req, res))
            .then(mergeWithUpcomingClass())
            .then(function (upcomingClass) {
                res.json(upcomingClass);
            })
            .catch(function (error) {
                res.status(500).send({error: error});  
            });
        
        
        //
        //db.getRequestedClass(req.params.id).then(function(requestedClass) {
        //    //console.log('api/requested/:id requestedClass', JSON.stringify(requestedClass));
        //    res.json(requestedClass);
        //}, function (err) {
        //    serverError(res, err);
        //});
        
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
                console.log('createdupcomingclass: ', JSON.stringify(createdUpcomingClass));
                res.json({status: 'success', createdUpcomingClass: createdUpcomingClass});
            })
            .catch(function (error) {
                console.log('errror : ', error);
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
        var defer = Q.defer();

        var eventToPost = {
            name: upcomingClass.name,
            time: upcomingClass.time
        };

        meetupApi.postEvent(req, res, eventToPost).then(function (r) {
            var response = JSON.parse(r);
            if (response && response.status === 'success') {
                defer.resolve(response.createdEvent)
            } else {
                defer.reject("Unable to post class to Meetup");
            }
        }, function (err) {
            defer.reject(err);
        });
        return defer.promise;
    }
}

function savePostedClassToDB(upcomingClass) {
    return function (createdEvent) {
        return Q.Promise(function (resolve, reject, notify) {
            var eventToSave = {
                eventId: createdEvent.id,
                category: upcomingClass.category
            };
            db.Upcoming.add(eventToSave).then(function (savedClass) {
                resolve(savedClass)
            }, function (err) {
                reject(err);
            });
        });
    }
}

function deleteAssocatedRequestedClass(upcomingClass) {
    return function(savedClass) {
        var defer = Q.defer();
        
        if (!upcomingClass.associatedRequestedClassId) defer.resolve();
        
        db.Requested.remove({ _id: upcomingClass.associatedRequestedClassId }).then(function () {
            
            defer.resolve(savedClass);
        }, function (err) {
            defer.reject(err);
        });
        
        return defer.promise;
    }
}

function getMeetupEvents(req, res) {
    return function () {
        return Q.Promise(function (resolve, reject, notify) {
            meetupApi.getEvents(req, res).then(resolve, reject);
        });
    }
}

function mergeWithUpcomingClasses() {
    return function (events) {
        return Q.Promise(function (resolve, reject, notify) {

            db.Upcoming.getAll().then(function (upcomingClasses) {

                _.map(events, function (e) {
                    var matchingClass = _.findWhere(upcomingClasses, { eventId: e.eventId });
                    e.category = matchingClass ? matchingClass.category : 'Unknown';
                });
                
                resolve(events);
                
            }, function (error) {
                reject(error);
            });
        });
    }
}
