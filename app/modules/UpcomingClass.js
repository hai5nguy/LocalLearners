var Q = require('../../node_modules/q');
//var uuid = require('../../node_modules/node-uuid');
var Database = require(LL_MODULES_DIR + 'Database.js');
var MeetupApi = require(LL_MODULES_DIR + 'MeetupApi.js');




var UpcomingClass = (function () {
    
    var promiseFunctions = {
        'allocateNew': allocateNew,
        'buildNew': buildNew,
        'validate': validate
    };
    
    return {
        invoke: function(name, context) {
            return function() {
                return Q.Promise(function (resolve, reject, notify) {
                    promiseFunctions[name](context, resolve, reject, notify);
                });
            };    
        }
    };
    

    //return {
    //    session: args.session,
    //    user: args.user,
    //    validate: validate,
    //    post: post
    //    
    //}
    //
    //function post(req, res) {
    //    var context = {};
    //    context.req = req;
    //    context.res = res;
    //    
    //    
    //    Q.fcall(db.Upcoming.createNewClass(context))
    //        .then(function (newClass) {
    //            //res back
    //            buildNewClass(context);
    //        }, function (error) {
    //            //res error
    //        })
    //        .done();
    //    
    //        
    //    
    //    
    //    
    //}
    //
    ////private
    //function buildNewClass(context) {
    //    Q.fcall(meetupApi.Event.post(context))
    //        .then(db.Upcoming.update(context))
    //        .catch(function () {
    //            //debug
    //        })
    //        .done();
    //}
    //var _this = this;
    //_this._id = null;
    //_this._category = {};
    //_this._status = null;
    //_this._time = null;
    //_this._teachers = [];
    //_this._associatedRequestedClassId = null;
    //
    //
    //_this.meetupData = 
    //    
    //    
    //_this._meetup = {
    //    user: {
    //        accessToken: args.meetup.user.accessToken,
    //        id: args.meetup.user.id
    //    },
    //    event: {
    //        name: args.meetup.event.name,
    //        time: args.meetup.event.time
    //    }
    //}
    //
    //
    //if (args.meetup.event.name) { _this.meetup.event.name = args.name }
    //if (args.category_id) { _this._category = args.category_id }
    //if (args.time) { _this._time = args.date }
    //if (args.teachers && args.teachers.length) { _this._teachers = args.teachers }
    //if (args.associatedRequestedClassId) { _this._associatedRequestedClassId = options.associatedRequestedClassId }
    //
    //
    //return {
    //    get name() { return _this._name },
    //    set name(value) { _this._name = value },
    //    blah: blah,
    //    validate: validate
    //}
    //
    //function validate() {
    //    return Q.Promise(function (resolve, reject, notify) {
    //        db.Upcoming.initialize().then(function (upcomingClass) {
    //            _this._id = upcomingClass._id;
    //            resolve(_this._id);
    //            
    //            
    //            Q.fcall(postClassToMeetup())
    //                .then(updateClassWithEvent())
    //                .then(deleteAssocatedRequestedClass())
    //                .catch(function (error) {
    //                    debug(FUNCTIONALITY.UpcomingClass_initialize, { error: error });
    //                })
    //                .done();
    //            
    //            
    //        }, reject);
    //        
    //    });
    //    
    //    
    //}
    //
    //function postClassToMeetup() {
    //    
    //    return function() {
    //        return Q.Promise(function (resolve, reject, notify) {
    //            var args = {
    //                user: {
    //                    accessToken: _this.userAccessToken,
    //                    id: _this.
    //                }
    //                userAccessToken: _this._userAccessToken,
    //                event: {
    //                    name: _this.name,
    //                    time: _this.time
    //                }
    //            };
    //
    //            meetupApi.Event.post(args).then(function (createdEvent) {
    //                debug(FUNCTIONALITY.UpcomingClass_postClassToMeetup, { createdEvent: createdEvent } );
    //                resolve(createdEvent);
    //            }, function (error) {
    //                debug(FUNCTIONALITY.UpcomingClass_postClassToMeetup, { error: error } );
    //                reject(error);
    //            });
    //        });
    //    }
    //}
    //
    //
    //function blah() {
    //    Q.fcall(saveToDatabase())
    //        .then()
    //        .then(savePostedClassToDB(upcomingClass))
    //        .then(deleteAssocatedRequestedClass(upcomingClass))
    //        .then(function (createdUpcomingClass) {
    //            debug(FUNCTIONALITY.api_post_upcoming, { createdUpcomingClass: createdUpcomingClass.toObject() } );
    //            res.json({status: 'success', createdUpcomingClass: createdUpcomingClass});
    //        })
    //        .catch(function (error) {
    //            debug(FUNCTIONALITY.api_post_upcoming, 'error', error);
    //            res.status(500).send({error: error});
    //        })
    //        .done();
    //}
    //
    //function saveToDatabase() {
    //    return function() {
    //        return Q.Promise(function (resolve, reject, notify) {
    //            
    //            var classToSave = {
    //                category: _this.category_id,
    //                status: UPCOMING_CLASS_STATUS.NOT_POSTED,
    //                meetup: {
    //                    event: {
    //                        id: null
    //                    }
    //                },
    //                teachers: _this.teachers
    //            };
    //
    //            db.Upcoming.add(classToSave).then(function (savedClass) {
    //                resolve(savedClass)
    //            }, function (err) {
    //                reject(err);
    //            });
    //        });
    //    }
    //}
    //
    //function validate() {
    //    return Q.Promise(function (resolve, reject, notify) {

    //    })
    //}
})();

function allocateNew(context, resolve, reject, notify) {
    Q.fcall(UpcomingClass('validate', context))
        .then(Database.Upcoming.allocateNew(context))
        .then(resolve)
        .catch(reject)
        .done();
}

function validate(context, resolve, reject, notify) {
    var classToValidate = context.upcomingClass;
    if (!IsPopulatedString(classToValidate.name)) {
        classToValidate.valid = false;
        classToValidate.invalidReason = 'Invalid class name';
        reject(context); return;
    }
    if (!IsPopulatedString(classToValidate.category)) {
        classToValidate.valid = false;
        classToValidate.invalidReason = 'Invalid class category';
        reject(context); return;
    }
    //if (!IsPopulatedString(classToValidate.time)) {
    //    classToValidate.valid = false;
    //    classToValidate.invalidReason = 'Invalid class time';
    //    resolve(context); return;
    //}
    
    classToValidate.valid = true;
    classToValidate.invalidReason = '';
    resolve(context);
}

function buildNew(context, resolve, reject, notify) {
    Q.fcall(MeetupApi('Event.post', context))
        .then(Database.Upcoming.update(context))
        .catch(function(context) {
            Database.Upcoming.update(context);
        })
        .done();
}

function test(context, resolve, reject, notify) {
    console.log('inside test');
//    console.log('inside upcoming test: ', context.test);
//    (context.resolve) ? resolve(context) : reject(context);
}

module.exports = UpcomingClass;