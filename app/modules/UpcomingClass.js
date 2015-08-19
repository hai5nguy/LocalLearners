var Q           = require(LL_NODE_MODULES_DIR + 'q');

var Database    = require(LL_MODULES_DIR + 'Database.js');
var MeetupApi   = require(LL_MODULES_DIR + 'Meetup.js');

/*
    req: req,
    name: req.body.name,
    category: req.body.category,
    time: req.body.time
 */

module.exports = function (params) {
    var upcomingClassSelf       = new BASEMODULE(params.initialData, parms.initialItems);

    upcomingClassSelf.req       = params.req;

    upcomingClassSelf.allocate  = PROMISIFY(allocate);
    upcomingClassSelf.build     = PROMISIFY(build);
    upcomingClassSelf.save      = PROMISIFY(save);
    

    function allocate (params, resolve, reject) {
        
        var nci = {
            category: upcomingClassSelf.Data.category
        };
        Database.UpcomingClass.allocate({ newClassInfo: nci }).then(function (upcomingClass) {
            upcomingClassSelf.Data.add(upcomingClass);
            resolve();
        }, function (error) {
            upcomingClassSelf.error = error;
            reject();
        });

    }

    function build (params, resolve, reject) {

        var meetupEvent = new Meetup.Event({
            req: upcomingClassSelf.req
        });
        
        var postArgs = {
            newEventInfo: {
                name: upcomingClassSelf.Data.get('name'),
                time: upcomingClassSelf.Data.get('time')
            }
        };

        MeetupApi.post(postArgs).then(function (meetupEvent) {
            upcomingClassSelf.Data.set('meetupEvent', meetupEvent);

            console.log(upcomingClassSelf.Data);
            
            //upcomingClassSelf.save();
            resolve();
        }, function (error) {
            console.error('error posting to meetup', upcomingClassSelf, error);
            reject();
        });

    }

    function save (params, resolve, reject) {

        Database.UpcomingClass.save(upcomingClassSelf).then(function (savedUpcomingClass) {
            resolve();
        }, function (error) {
            upcomingClassSelf.error = error;
            reject();
        });

    }

    return upcomingClassSelf;
};


function Item (params) {

   
}

function Collection (options) {

    var collectionSelf = new BASECOLLECTION();

    collectionSelf.error = null;
    collectionSelf.req = options.req;

    collectionSelf.load = PROMISIFY(function (options, resolve, reject) {
            
            Database.read({ collectionName: 'UpcomingClasses' }).then(function (upcomingClasses) {
                collectionSelf.add(upcomingClasses);
                resolve();
            }, function (error) {
                collectionSelf.error = error;
                reject();
            });
    });
        
    return collectionSelf;

}





//
//var UpcomingClass = (function () {
//    
//    return {
//        allocateNew: CONTEXTPROMISE(allocateNew),
//        buildNew: CONTEXTPROMISE(buildNew),
//        getAll: CONTEXTPROMISE(getAll),
//        RSVP: RSVP(),
//        validate: CONTEXTPROMISE(validate)
//    };
//    
//    function getAll(context, resolve, reject, notify) {
//        context.set('database.query', {});
//        Database.Upcoming.getAll(context)().then(resolve, reject);
//    }
//    
//    function allocateNew(context, resolve, reject, notify) {
//        Q.fcall(UpcomingClass.validate(context))
//            .then(Database.Upcoming.allocateNew(context))
//            .then(resolve)
//            .catch(reject)
//            .done();
//    }
//    
//    function buildNew(context, resolve, reject, notify) {
//        Q.fcall(MeetupApi.Event.post(context))
//            .then(function() {
//                context.set('database.query', { _id: context.get('upcomingclass.allocated')._id },
//                    args: { $set: context.UpcomingClass.class }  
//                };
//                resolve();
//                
//                return Database.Upcoming.update(context)();
//            })
//            .then(resolve)
//            .catch(reject)
//            .done();
//    }
//    
//    function validate(context, resolve, reject, notify) {
//        var newClass = context.get('upcomingclass.new');
//        if (!IsPopulatedString(newClass.name)) {
//            context.Error = {
//                message: 'Invalid class name'
//            };
//            reject(); return;
//        }
//        if (!IsPopulatedString(newClass.category)) {
//            context.Error = {
//                message: 'Invalid class category'
//            }
//            reject(); return;
//        }
//        //if (!IsPopulatedString(classToValidate.time)) {
//        //    classToValidate.valid = false;
//        //    classToValidate.invalidReason = 'Invalid class time';
//        //    resolve(context); return;
//        //}
//        resolve();
//    }
//    
//})();
//module.exports = UpcomingClass;
//
//
//function RSVP() {
//    
//}
//    var promiseFunctions = {
//        'allocateNew': allocateNew,
//        'buildNew': buildNew,
//        'validate': validate
//    };
//    
//    return {
//        invoke: function(name, context) {
//            return function() {
//                return Q.Promise(function (resolve, reject, notify) {
//                    promiseFunctions[name](context, resolve, reject, notify);
//                });
//            };    
//        }
//    };
//    

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


//
//function buildNew(context, resolve, reject, notify) {
//    Q.fcall(MeetupApi('Event.post', context))
//        .then(Database.Upcoming.update(context))
//        .catch(function(context) {
//            Database.Upcoming.update(context);
//        })
//        .done();
//}
//
//function test(context, resolve, reject, notify) {
//    console.log('inside test');
////    console.log('inside upcoming test: ', context.test);
////    (context.resolve) ? resolve(context) : reject(context);
//}

