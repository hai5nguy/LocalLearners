var Q = require('../../node_modules/q');
//var uuid = require('../../node_modules/node-uuid');
//var db = require('../db.js')(THE_APP);


module.exports = function (args) {
    var _this = this;
    
    
    _this._id = null;
    _this._name = null;
    _this._time = null;
    
    
    if (args.id) { _this._id = args.id }
    if (args.name) { _this._name = args.name }
    if (args.time) { _this._time = args.date }

    return {
        //initialize: initialize,
        get name() { return _this._name },
        set name(value) { _this._name = value },
        //blah: blah,
        //validate: validate
        
        post: post
    }

    function post(args) {
        return Q.Promise(function (resolve, reject, notify) {
                
            args.event = {
                name: _this.name,
                time: _this.time
            };
            
            meetupApi.Event.post(args).then(function (createdEvent) {
                debug(FUNCTIONALITY.UpcomingClass_postClassToMeetup, { createdEvent: createdEvent } );
                resolve(createdEvent);
            }, function (error) {
                debug(FUNCTIONALITY.UpcomingClass_postClassToMeetup, { error: error } );
                reject(error);
            });
        });
        
        
        
    }
    function initialize() {
        return Q.Promise(function (resolve, reject, notify) {
            db.Upcoming.initialize().then(function (upcomingClass) {
                _this._id = upcomingClass._id;
                resolve(_this._id);


                Q.fcall(postClassToMeetup())
                    .then(updateClassWithEvent())
                    .then(deleteAssocatedRequestedClass())
                    .catch(function (error) {
                        debug(FUNCTIONALITY.UpcomingClass_initialize, { error: error });
                    })
                    .done();


            }, reject);

        });


    }

    function postClassToMeetup() {

        return function() {
            return Q.Promise(function (resolve, reject, notify) {
                var args = {
                    user: {
                        accessToken: _this.userAccessToken,
                        id: _this.
                    }
                    userAccessToken: _this._userAccessToken,
                    event: {
                        name: _this.name,
                        time: _this.time
                    }
                };

                meetupApi.Event.post(args).then(function (createdEvent) {
                    debug(FUNCTIONALITY.UpcomingClass_postClassToMeetup, { createdEvent: createdEvent } );
                    resolve(createdEvent);
                }, function (error) {
                    debug(FUNCTIONALITY.UpcomingClass_postClassToMeetup, { error: error } );
                    reject(error);
                });
            });
        }
    }


    function blah() {
        Q.fcall(saveToDatabase())
            .then()
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
    }

    function saveToDatabase() {
        return function() {
            return Q.Promise(function (resolve, reject, notify) {

                var classToSave = {
                    category: _this.category_id,
                    status: UPCOMING_CLASS_STATUS.NOT_POSTED,
                    meetup: {
                        event: {
                            id: null
                        }
                    },
                    teachers: _this.teachers
                };

                db.Upcoming.add(classToSave).then(function (savedClass) {
                    resolve(savedClass)
                }, function (err) {
                    reject(err);
                });
            });
        }
    }

    function validate() {
        return Q.Promise(function (resolve, reject, notify) {
            if ( IsPopulatedString(this_._name) &&
                IsPopulatedString(_this._category_id) &&
                IsPopulatedNumber(_this._time)
            ) {
                resolve();
            } else {
                reject({ error: 'Upcoming class invalid' });
            }
        })
    }
}


