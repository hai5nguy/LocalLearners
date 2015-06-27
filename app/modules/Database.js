var Q   	            = require(LL_NODE_MODULES_DIR + 'q');
var mongoose            = require(LL_NODE_MODULES_DIR + 'mongoose');

var Models              = require(LL_MODULES_DIR + 'Models.js')(mongoose);

var mongooseConnection  = mongoose.connection;

//mongoose.set('debug', true);
mongoose.connect(LL_MONGODB_CONNECTION_STRING);

mongooseConnection.once('open', function() {
    console.log('Connected to mongolab, database ready.');
});

var Database = (function () {
    return {
        Category: Category(),
        Requested: Requested(),
        Upcoming: Upcoming(),
        User: User()
    };
})();

function Category() {
    return {
        getAll: CONTEXTPROMISE(getAll)
    };
    
    function getAll(context, resolve, reject, notify) {
        Models.Category.find({}, function(error, categories) {
            if (error) {
                context.Error = {
                    message: 'Unable to get all categories',
                    database_error: error
                };
                reject();
            } else {
                context.Category.all = categories;
                resolve();
            }
        });
    }
    
}

function Requested() {
    return {
        addInterestedUser: CONTEXTPROMISE(addInterestedUser),
        removeInterestedUser: CONTEXTPROMISE(removeInterestedUser),
        allocateNew: CONTEXTPROMISE(allocateNew),
        get: CONTEXTPROMISE(get),
        getAll: CONTEXTPROMISE(getAll),
        populateRecord: CONTEXTPROMISE(populateRecord),
        syncRecord: CONTEXTPROMISE(syncRecord),
        update: CONTEXTPROMISE(update)
    };
    
    function addInterestedUser(context, resolve, reject, notify) {
        Database.Requested.syncRecord(context)().then(function () {
            var interestedUsers = context.RequestedClass.record.interestedUsers;
            var user = context.Authentication.user;
            if (interestedUsers.indexOf(user._id) === -1) {
                interestedUsers.push(user);
            }
            Database.Requested.syncRecord(context)().then(resolve, reject);
        }, reject);
    }
    
    function removeInterestedUser(context, resolve, reject, notify) {
        Database.Requested.syncRecord(context)().then(function () {
            var interestedUsers = context.RequestedClass.record.interestedUsers;
            var user = context.Authentication.user;
            var existingIndex = interestedUsers.indexOf(user._id);
            if (existingIndex !== -1) {
                interestedUsers.splice(existingIndex, 1);
            }
            Database.Requested.syncRecord(context)().then(resolve, reject);
        }, reject);
    }
    
    function allocateNew(context, resolve, reject, notify) {
        var newRequest = new Models.RequestedClass(context.RequestedClass.newRequest);
        newRequest.save(function(error, newRequest, numberAffected) {
            if (!error) {
                context.RequestedClass.record = newRequest.toObject();
                resolve();
            } else {
                context.Error = {
                    message: 'Unable to allocate new request',
                    database_error: error
                };
                reject();
            }
        });
    }
    
    //this is going to be phase out by populate
    function get(context, resolve, reject, notify) {
        var query = Models.RequestedClass.find(context.Database.query);
        query.populate('category');
        query.populate('requester', 'name meetupProfile.photo.thumb_link');
        query.populate('interestedUsers', 'name meetupProfile.photo.thumb_link');
        query.exec(function (error, requests) {
            if (!error) {
                context.RequestedClass.record = requests[0];
                resolve();
        	} else {
                context.Error = {
                    message: 'Unable to get requested class',
                    database_error: error
                };
                reject();
            }
        });
    }
    
    function getAll(context, resolve, reject, notify) {
        var query = Models.RequestedClass.find(context.Database.query);
        query.populate('category');
        query.exec(function (error, requestedClasses) {
            if (!error) {
                context.RequestedClass.requestList = requestedClasses; 
                resolve();
            } else {
                context.Error = {
                    message: 'Error trying to get requested classes from database.',
                    database_error: error
                }; 
                reject();
            }
        });
    }
    
    function populateRecord(context, resolve, reject, notify) {
        var query = Models.RequestedClass.find({ _id: context.RequestedClass.record._id });
        query.populate('category');
        query.populate('requester', 'name meetupProfile.photo.thumb_link');
        query.populate('interestedUsers', 'name meetupProfile.photo.thumb_link');
        query.exec(function (error, requests) {
            if (!error) {
                context.RequestedClass.record = requests[0];
                resolve();
        	} else {
                context.Error = {
                    message: 'Unable to populate requested class',
                    database_error: error
                };
                reject();
            }
        });
    }
    
    function syncRecord(context, resolve, reject, notify) {
        var query = { _id: context.RequestedClass.record._id };
        Models.RequestedClass.findOneAndUpdate(query, context.RequestedClass.record, function (error, updatedRequest) {
            if (!error) {
                context.RequestedClass.record = updatedRequest;
                resolve();
            } else {
                context.Error = {
                    message: "Error syncing requested class record",
                    database_error: error
                };
                reject();
            }
        });
    }
    
    //deprecated, use sync
    function update(context, resolve, reject, notify) {
         Models.RequestedClass.findOneAndUpdate(context.Database.query, context.Database.arg, function (error, updatedRequest) {
            if (!error) {
                context.RequestedClass.record = updatedRequest;
                resolve();
            } else {
                context.Error = {
                    message: 'Error updating requested class in Database',
                    database_error: error
                };
                reject();
            }
        });
    }
    
    
    
}

function Upcoming() {
    return {
        allocateNew: CONTEXTPROMISE(allocateNew),
        getAll: CONTEXTPROMISE(getAll),
        update: CONTEXTPROMISE(update)
    }
    
    function allocateNew(context, resolve, reject, notify) {
        var newClass = context.get('upcomingclass.new');
        var model = new Models.UpcomingClass({
            category: newClass.category,
            meetup: {
                event: {
                    name: newClass.name,
                    time: newClass.time
                }
            },
            teachers: newClass.teachers
        });
        model.save(function(error, newClass, numberAffected) {
            if (!error) {
                context.get('upcomingclass.allocated', newClass);
                resolve();
            } else {
                context.set('error', {
                    message: 'Unable to allocate new upcoming class',
                    database_error: error
                });
                reject();
            }
        });
    }
    
    function getAll(context, resolve, reject, notify) {
        
        var query = Models.UpcomingClass.find(context.get('database.query'));
        query.populate('category');
        query.populate('teachers', 'name');
        query.exec(function (error, classes) {
            if (!error) {
                context.set('upcomingclass.list', classes);
                resolve();
        	} else {
                context.set('error', {
                    message: 'Unable to get upcoming classes',
                    database_error: error
                });
                reject();
            }
        });
        
    }
    
    function update(context, resolve, reject, notify) {
        Models.UpcomingClass.findOneAndUpdate(context.Database.query, context.Database.arg, function (error, updatedClass) {
            if (!error) {
                context.UpcomingClass.savedClass = updatedClass;
                resolve();
            } else {
                context.Error = {
                    message: 'Error updating upcoming class in Database',
                    database_error: error
                };
                reject();
            }
            debug(FUNCTIONALITY.Database_Upcoming_update, 'Upcoming.update', { context: context, error: error, updatedClass: updatedClass });
        });
    }

    
}

function User() {
    return {
        get: CONTEXTPROMISE(get),
        insert: CONTEXTPROMISE(insert),
        sync: CONTEXTPROMISE(sync),
        update: CONTEXTPROMISE(update),
        upsert: CONTEXTPROMISE(upsert)
    };

    function get(context, resolve, reject, notify) {
        Models.User.findOne(context.Database.query, function(error, user) {
            if (error) { 
                context.Error = {
                    message: 'Error querying user',
                    database_error: error
                };
                reject();    
            } else {
                context.Authentication.user = user;
                resolve();
            }
        });
    }
    
    function insert(context, resolve, reject, notify) {
        var newUser = new Models.User(context.Authentication.user);
        newUser.save(function(error, newUser, numberAffected) {
            if (error) {
                context.Error = {
                    message: 'Unable insert user to database',
                    db_Error: error
                };
                reject();
            } else {
                context.Authentication.user = newUser;
                resolve();
            }
            debug(FUNCTIONALITY.Database_User_insert, 'User.insert', { error: error, newUser: newUser.toObject(), numberAfftected: numberAffected });
        });
    }
    
    function sync(context, resolve, reject, notify) {
        Models.User.findOneAndUpdate({ _id: context.Authentication.user._id }, context.Authentication.user, function(error, user) {
            if (!error) {
                context.Authentication.user = user;
                resolve();
            } else { 
                context.Error = {
                    message: 'Error syncing user',
                    database_error: error
                };
                reject();    
            } 
        });
    }
    
    function upsert(context, resolve, reject, notify) {
        debug(FUNCTIONALITY.Database_User_upsert, 'User.upsert', { context: context });
        Models.User.findOne(context.Database.query, function (error, foundUser) {
            if (foundUser) {
                Database.User.update(context)().then(resolve, reject);
            } else {
                Database.User.insert(context)().then(resolve, reject);
            }
        });
    }

    function update(context, resolve, reject, notify) {
        var updatedUser = {
            meetupProfile: context.Authentication.user.meetupProfile
        };
        Models.User.update(context.Database.query, { $set: updatedUser }, function (error, numberAffected) {
            debug(FUNCTIONALITY.Database_User_update, 'update', { context: context, error: error, numberAffected: numberAffected });
            if (error) {
                context.Error = {
                    message: 'Error updating user to database',
                    db_Error: error
                }
                reject(context);
            } else {
                context.Database.query = { 'meetupProfile.id': context.Authentication.user.meetupProfile.id };
                Database.User.get(context)().then(resolve, reject);
            }
        });
    }

}

module.exports = Database;



//
//module.exports = function(args) {
//
//    return {
//        session: args.session,
//        user: args.user,
//        Category: {
//            get: Category_get,
//            getAll: Category_getAll,
//            add: Category_add
//        },
//
//        Upcoming: {
//            add: Upcoming_add,
//            get: Upcoming_get,
//            getAll: Upcoming_getAll,
//            initialize: Upcoming_initialize,
//            remove: Upcoming_remove,
//            RSVP: {
//                syncWithEvent: Upcoming_RSVP_syncWithEvent
//            },
//            update: Upcoming_update,
//            updateAll: Upcoming_updateAll
//        },
//
//        //addUpcomingClass: addUpcomingClass,
//        removeUpcomingClasses: removeUpcomingClasses,
//        upsertUpcomingClasses: upsertUpcomingClasses,
//
//        /* special stuff */
//        addCategoriesToEvents: addCategoriesToEvents,
//
//        /* requested classes */
//        getRequestedClass: getRequestedClass,
//        getRequestedClasses: getRequestedClasses,
//
//        Requested: {
//            add: Requested_add,
//            get: Requested_get,
//            getAll: Requested_getAll,
//            remove: Requested_remove,
//            setUserInterested: Requested_setUserInterested
//
//        },
//
//        /* users */
//        User: {
//            get: User_get,
//            upsert: User_upsert
//        },
//
//        /* fakes - development purpose */
//        insertFakeEvents: insertFakeEvents,
//        getFakeEvents: getFakeEvents,
//        addFakeEvent: addFakeEvent,
//        FakeEvent: {
//            get: FakeEvent_get
//        }
//    }
//}
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// Public Functions
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//function Category_get(query) {
//    var defer = Q.defer();
//    Models.Category.findOne(query, function (err, category) {
//        if (err) {
//            defer.reject(err);
//        } else {
//            defer.resolve(category);
//        }
//    });
//    return defer.promise;
//}
//

//
//
//function Category_add(category) {
//    var defer = Q.defer();
//
//    var newCategory = new Models.Category(category);
//    newCategory.save(function (err, c, numberAffected) {
//        if (!err) {
//            defer.resolve();
//        } else {
//            defer.reject(err);
//        }
//    });
//
//    return defer.promise;
//}
//
//function Upcoming_add(upcomingClass) {
//    return Q.Promise(function(resolve, reject, notify) {
//        var u = new Models.UpcomingClass(upcomingClass);
//        u.save(function(error, u, numberAffected) {
//            debug(FUNCTIONALITY.db_Upcoming_add, { error: error, u: u.toObject(), numberAffected: numberAffected } );
//            error ? reject(error) : resolve(u);
//        });
//    });
//}
//function removeUpcomingClasses(upcomingClasses) {
//    var defer = Q.defer();
//    var ids = _.pluck(upcomingClasses, 'eventId');
//    Models.UpcomingClass.remove({ eventId: { $in: ids }}, function (err, nRemoved, unknown) {
//        if (err) { defer.reject(err) }
//        else { defer.resolve() }
//    });
//    return defer.promise;
//}
//
//function Upcoming_get(id) {
//    return Q.Promise(function (resolve, reject, notify) {
//        var query = Models.UpcomingClass.find({ _id: id });
//        query.populate('category');
//        query.exec(function (err, upcomingClasses) {
//            err ? reject(err) : resolve(upcomingClasses[0]);
//        });
//    });
//}
//
//function Upcoming_initialize() {
//    return Q.Promise(function (resolve, reject, notify) {
//        var newUpcomingClass = new Models.Upcoming({ status: UPCOMING_CLASS_STATUS.NEW });
//        newUpcomingClass.save(function(error, newUpcomingClass, numberAffected) {
//            debug(FUNCTIONALITY.Database_Upcoming_allocateNew, { error: error, newUpcomingClass: newUpcomingClass.toObject(), numberAffected: numberAffected } );
//            error ? reject(error) : resolve(newUpcomingClass);
//        });
//    })
//}
//
//function Upcoming_getAll() {
//    return Q.Promise(function (resolve, reject, notify) {
//        var query = Models.UpcomingClass.find({});
//        query.populate('category');
//        query.exec(function (err, upcomingClasses) {
//            err ? reject(err) : resolve(upcomingClasses);
//        });
//    });
//}
//
//function Upcoming_remove(query) {
//    return Q.Promise(function (resolve, reject, notify) {
//        Models.UpcomingClass.remove(query, function (error, numberAffected, result) {
//            debug(FUNCTIONALITY.db_Upcoming_remove, { error: error, numberAffected: numberAffected, result: result });
//            error ? reject(error) : resolve();
//        });
//    });
//}
//
//function Upcoming_RSVP_syncWithEvent(event) {
//
//}
//

//
//function Upcoming_updateAll(upcomingClasses) {
//    return Q.Promise(function (resolve, reject, notify) {
//        Models.UpcomingClass.update({}, upcomingClasses)
//    })
//
//}
//function upsertUpcomingClasses(upcomingClass) {
//    var defer = Q.defer();
//
//    var classFound;
//    getUpcomingClasses({ eventId: upcomingClass.eventId })
//        .then(
//        function (c) {
//            classFound = c
//        },
//        function (err) {
//            defer.reject()
//        }
//        , function(oldClass) {
//            if (IsEmptyNullUndefined(oldClass)) {
//                createUpcomingClass(upcomingClass);
//            }
//            else {
//                upcomingClass._id = oldClass[0]._id;
//                updateUpcomingClass(upcomingClass);
//            }
//            defer.resolve()
//        });
//    return defer.promise;
//}
//
//function addCategoriesToEvents(events) {
//
//
//    var defer = Q.defer();
//
//    var eventIds = _.pluck(events, 'eventId');
//
//    Models.UpcomingClass.find({ eventId: { $in: eventIds }}, function(err, upcomingClasses) {
//
//
//        var eventsWithCategory =  _.map(events, function (e) {
//
//
//            var matchingClass = _.findWhere(upcomingClasses, { eventId: e.eventId});
//            e.category = matchingClass ? matchingClass.category : 'Unknown';
//            return e;
//        });
//
//        defer.resolve(eventsWithCategory);
//    });
//
//    return defer.promise;
//}
//
//function Requested_add(requested) {
//    var defer = Q.defer();
//    var r = new Models.RequestedClass(requested);
//    r.save(function(err, r, numberAffected) {
//        console.log('db.Requested_add ', JSON.stringify(r));
//        if (err) { defer.reject(err) }
//        else { defer.resolve(r) }
//    });
//    return defer.promise;
//}
//
//function getRequestedClass(id) {
//    var defer = Q.defer();
//    var query = Models.RequestedClass.find({ _id: id});
//    query.populate('requester', 'name thumbLink');
//    query.populate('interestedUsers', 'name thumbLink');
//    query.exec(function (err, requestClasses) {
//        if (!err) {
//            defer.resolve(requestClasses[0]);
//        } else {
//            defer.reject(err);
//        }
//    });
//    return defer.promise;
//}
//
//function getRequestedClasses(id) {
//    var defer = Q.defer();
//    var query = id ? { _id: id } : {};
//    Models.RequestedClass.find(query, function(err, requestedClasses) {
//        if (err) { defer.reject(err) }
//        else { defer.resolve(requestedClasses) }
//    });
//    return defer.promise;
//}
//
//function Requested_get(id) {

//}
//
//function Requested_getAll() {
//    return Q.Promise(function (resolve, reject, notify) {
//        var query = Models.RequestedClass.find({});
//        query.populate('category');
//        query.exec(function (err, requestedClasses) {
//            err ? reject(err) : resolve(requestedClasses);
//        });
//    });
//}
//
//
//function Requested_remove(query) {
//    return Q.Promise(function (resolve, reject, notify) {
//        Models.RequestedClass.remove(query, function (error, numberRemoved, result) {
//            debug(FUNCTIONALITY.db_Requested_remove, 'error', error, 'numberRemoved', numberRemoved, 'result', result);
//            error ? reject(error) : resolve(result);
//        });
//    });
//}
//
//function Requested_setUserInterested(requestedClassId, userId, interested) {
//    var defer = Q.defer();
//    var findRequested = Models.RequestedClass.findOne({ _id: requestedClassId }).exec();
//    findRequested.then(function (requestedClass,a,b,c) {
//
//        if (interested) {
//            addUserToInterested(requestedClass);
//        } else {
//            removeUserFromInterested(requestedClass);
//        }
//        requestedClass.save(function (err, savedRequested) {
//            if (!err) {
//                thisModule.Requested.get(requestedClass._id).then(defer.resolve, defer.reject);
//            } else {
//                defer.reject('Unable to set user interested, err: ' + JSON.stringify(err));
//            }
//        });
//
//    }, function (err) {
//        console.err('Requested_setUserInterested err: ', err);
//        defer.reject(err);
//    });
//
//    function addUserToInterested(requestedClass) {
//        if (requestedClass.interestedUsers.indexOf(userId) === -1) {
//            requestedClass.interestedUsers.push(userId);
//        }
//    }
//
//    function removeUserFromInterested(requestedClass) {
//        var existingUserIndex = requestedClass.interestedUsers.indexOf(userId);
//        if (existingUserIndex !== -1) {
//            requestedClass.interestedUsers.splice(existingUserIndex, 1);
//        }
//    }
//    return defer.promise;
//}
//

//

//

//function insertUpcomingClass(upcomingClass) {
//    var defer = Q.defer();
//    var u = new Models.UpcomingClass(upcomingClass);
//    u.save(function(err, u, numberAffected) {
//        console.log('db insertUpcomingClass ', JSON.stringify(u));
//        if (err) { defer.reject(err) }
//        else { defer.resolve(u) }
//    });
//    return defer.promise;
//}
//
//function updateUpcomingClass(upcomingClass) {
//    var defer = Q.defer();
//    Models.UpcomingClass.update({ _id: upcomingClass._id }, upcomingClass, {}, function(err, numberAffected) {
//        console.log('db updateUpcomingClass ', upcomingClass);
//        if (err) { defer.reject(err) }
//        else { defer.resolve(upcomingClass) }
//    });
//    return defer.promise;
//}
//

//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////for local development
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//function insertFakeEvents(fakeEvents) {
//    for (var i = 0; i < fakeEvents.length; i++) {
//        var newEvent = new Models.FakeEvent(fakeEvents[i]);
//        newEvent.save(function (err, fakeEvent, numberAffected) {
//            if (err) {
//                //TODO: handle errors
//                return;
//            }
//        });
//    }
//}
//
//function getFakeEvents(callback) {
//    Models.FakeEvent.find({}, function(err, events) {
//        callback(events);
//    });
//}
//
//function addFakeEvent(fakeEvent) {
//    var defer = Q.defer();
//
//    if (!isValidFakeEvent(fakeEvent)) {
//        defer.reject('Invalid fakeEvent');
//    }
//
//    var fe = new Models.FakeEvent(fakeEvent);
//    fe.save(function (err, savedEvent, numberAffected) {
//        if (err) {
//            defer.reject('Can not save fakeEvent');
//        } else {
//            defer.resolve(savedEvent);
//        }
//    });
//
//    return defer.promise;
//}
//
//function FakeEvent_get(id) {
//    return Q.Promise(function (resolve, reject, notify) {
//        Models.FakeEvent.findOne({ id: id }, function (err, fakeEvent) {
//            err ? reject(err) : resolve(fakeEvent);
//        });
//    });
//}
//
//function isValidFakeEvent(fakeEvent) {
////    if (typeof fakeEvent.visibility !== 'string') return false;
////    if (typeof fakeEvent.status !== 'string') return false;
////    if (typeof fakeEvent.maybe_rsvp_count !== 'number') return false;
////    if (typeof fakeEvent.utc_offset !== 'number') return false;
////    if (typeof fakeEvent.id !== 'string') return false;
////    console.log('typeof fakeevent.time ', fakeEvent.time );
////    if (typeof fakeEvent.time !== 'number') return false;
////    if (typeof fakeEvent.announced !== 'boolean') return false;
////    if (typeof fakeEvent.waitlist_count !== 'number') return false;
////    if (typeof fakeEvent.created !== 'object') return false;
////    if (typeof fakeEvent.yes_rsvp_count !== 'number') return false;
////    if (typeof fakeEvent.updated !== 'object') return false;
////    if (typeof fakeEvent.event_url !== 'string') return false;
////    if (typeof fakeEvent.headcount !== 'number') return false;
//    if (typeof fakeEvent.name !== 'string') return false;
////    if (typeof fakeEvent.group !== 'object') return false;
////    if (typeof fakeEvent.group.id !== 'number') return false;
////    if (typeof fakeEvent.group !== 'object') return false;
////    if (typeof fakeEvent.group !== 'object') return false;
////    if (typeof fakeEvent.group !== 'object') return false;
////    if (typeof fakeEvent.group !== 'object') return false;
////    if (typeof fakeEvent.group !== 'object') return false;
////    if (typeof fakeEvent.group !== 'object') return false;
////    if (typeof fakeEvent.group !== 'object') return false;
////    if (typeof fakeEvent.group !== 'object') return false;
////    visibility: String,
////        status: String,
////        maybe_rsvp_count: Number,
////        utc_offset: Number,
////        id: String,
////        time: Date,
////        announced: Boolean,
////        waitlist_count: Number,
////        created: Date,
////        yes_rsvp_count: Number,
////        updated: Date,
////        event_url: String,
////        headcount: Number,
////        name: String,
////        group: {
////        id: Number,
////            created: Date,
////            group_lat: Number,
////            name: String,
////            group_lon: Number,
////            join_mode: String,
////            urlname: String,
////            who: String
////    }
//    return true;
//}
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
