var Q = require('../../node_modules/q');
var meetupApi = require('../meetup-api.js')(THE_APP);
var db = require('../db.js')(THE_APP);

module.exports = function (app) {

    app.get('/upcomingclasses', function (req, res) {
        meetupApi.getEvents(req, res)
            .then(function(events) {
                return db.addCategoriesToEvents(events);
            })
            .then(function (eventsWithCategories) {
               //console.log('eventsWithCategories ', JSON.stringify(eventsWithCategories));
                res.json(eventsWithCategories);
            },
            function() {
                res.json({
                    error: 'Can not retrieve classes'
                });
            });

    });

    app.get('/upcomingclasses/:id', function (req, res) {
        //TODO: implement this
        res.json({ upcomingclass: 'upcoming class with id ' + req.params.id });

    });

    app.post('/api/upcoming', function(req, res) {
        var upcomingClass = {
            name: req.body.name,
            categoryName: req.body.categoryName,
            time: new Date(req.body.time).getTime(),
            associatedRequestedClassId: req.body.associatedRequestedClassId
        };
        
        Q.fcall(validateUpcomingClass(upcomingClass))
            .then(postToMeetup(req, res, upcomingClass))
            .then(savePostedClassToDB(upcomingClass))
            .then(deleteAssocatedRequestedClass(upcomingClass.associatedRequestedClassId))
            .catch(function (error) {
                res.status(500).send({ error: err });
            })
            .done(function (createdUpcomingClass) {
                res.json({ status: 'success', createdUpcomingClass: createdUpcomingClass });
            });
    });
 
        
        
//
//        if (isUpcomingClassValid(upcomingClass)) {
//            var eventToPost = {
//                name: upcomingClass.name,
//                time: upcomingClass.time
//            };
//
//            meetupApi.postEvent(req, res, eventToPost).then(function (r) {
//
//                var response = JSON.parse(r);
//                if (response && response.status === 'success') {
//                    var createdEvent = response.createdEvent;
//
//                    db.getCategory({ name: upcomingClass.categoryName }).then(function (category) {
//
//                        var eventToSave = {
//                            eventId: createdEvent.id,
//                            category: category
//                        };
//
//                        db.addUpcomingClass(eventToSave).then(function (savedClass) {
//
////                            console.log('/upcomingclasses savedClass ', JSON.stringify(savedClass));
//                            
//                            
//                            
//                            res.json({ status: 'success', savedClass: savedClass });
//
//                        }, function (err) {
//                            serverError(res, err);
//                        });
//
//                    }, function (err) {
//                        serverError(res, err);
//                    });
//
//                } else {
//                    serverError(res, r);
//                }
//
//            }, function (err) {
//                serverError(res, err);
//            });
//
//        } else {
//            serverError(res, { error: 'Upcoming Class invalid' });
//        }
    });
}

function isUpcomingClassValid(upcomingClass) {
    return (
        IsPopulatedString(upcomingClass.name) &&
        IsPopulatedString(upcomingClass.categoryName) &&
        IsPopulatedNumber(upcomingClass.time)
    )
}

function validateUpcomingClass(upcomingClass) {
    return function() {
        var defer = Q.defer();
        if ( IsPopulatedString(upcomingClass.name) &&
            IsPopulatedString(upcomingClass.categoryName) &&
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
    
    return function(createdEvent) {
        var defer = Q.defer();
        
        db.getCategory({ name: upcomingClass.categoryName }).then(function (category) {
            var eventToSave = {
                eventId: createdEvent.id,
                category: category
            };
            db.addUpcomingClass(eventToSave).then(function (savedClass) {

                            

                        }, function (err) {
                            serverError(res, err);
                        });
    }

//
//                    db.getCategory({ name: upcomingClass.categoryName }).then(function (category) {
//
//                        var eventToSave = {
//                            eventId: createdEvent.id,
//                            category: category
//                        };
//
//                        db.addUpcomingClass(eventToSave).then(function (savedClass) {
//
////                            console.log('/upcomingclasses savedClass ', JSON.stringify(savedClass));
//                            
//                            
//                            
//                            res.json({ status: 'success', savedClass: savedClass });
//
//                        }, function (err) {
//                            serverError(res, err);
//                        });
//
//                    }, function (err) {
//                        serverError(res, err);
//                    });
    
    
    return defer.promise;
}

//function serverError(res, err) {
//    res.status(500).send({ error: err });
//}
