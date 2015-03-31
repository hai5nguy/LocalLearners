var _ = require('underscore');
var Q = require('q');
var mongoose = require('mongoose');
var models = require('./db-models.js')(mongoose);
var db = mongoose.connection;

//mongoose.set('debug', true);
mongoose.connect(LL_MONGODB_CONNECTION_STRING);

db.once('open', function() {
    console.log('Connected to mongolab, database ready.');
});

var thisModule;

module.exports = function(app) {

    thisModule = {

        /* categories */
        //getCategories: getCategories,
        //getCategory: getCategory,
        //insertCategories: insertCategories,
        
        Category: {
            get: Category_get,
            getAll: Category_getAll,
            add: Category_add
        },

        /* upcoming classes */
        
        Upcoming: {
            add: Upcoming_add,
            get: Upcoming_get,
            getAll: Upcoming_getAll
        },
        
        //addUpcomingClass: addUpcomingClass,
        removeUpcomingClasses: removeUpcomingClasses,
        upsertUpcomingClasses: upsertUpcomingClasses,
        
        /* special stuff */
        addCategoriesToEvents: addCategoriesToEvents,

        /* requested classes */
        getRequestedClass: getRequestedClass,
        getRequestedClasses: getRequestedClasses,
        
        Requested: {
            add: Requested_add,
            get: Requested_get,
            getAll: Requested_getAll,
            remove: Requested_remove,
            setUserInterested: Requested_setUserInterested
            
        },

        /* users */
        getUser: getUser,
		//addUser: addUser,
        upsertUser: upsertUser,

        /* fakes - development purpose */
        insertFakeEvents: insertFakeEvents,
        getFakeEvents: getFakeEvents,
        addFakeEvent: addFakeEvent
    }
    
    return thisModule;
    
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Public Functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Category_get(query) {
    var defer = Q.defer();
    models.Category.findOne(query, function (err, category) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(category);
        }
    });
    return defer.promise;
}

function Category_getAll() {
    var defer = Q.defer();
    models.Category.find({}, function(err, categories) {
        if (err) { defer.reject(err) }
        else { defer.resolve(categories) }
    });
    return defer.promise;
}


function Category_add(category) {
    var defer = Q.defer();
    
    var newCategory = new models.Category(category);
    newCategory.save(function (err, c, numberAffected) {
        if (!err) {
            defer.resolve();
        } else {
            defer.reject(err);
        }
    });

    return defer.promise;
}

function Upcoming_add(upcomingClass) {
    return Q.Promise(function(resolve, reject, notify) {
        var u = new models.UpcomingClass(upcomingClass);
        u.save(function(err, u, numberAffected) {
            console.log('db.Upcoming_add ', JSON.stringify(u));
            if (err) { reject(err) }
            else { resolve(u) }
        });
    });
}
function removeUpcomingClasses(upcomingClasses) {
    var defer = Q.defer();
    var ids = _.pluck(upcomingClasses, 'eventId');
    models.UpcomingClass.remove({ eventId: { $in: ids }}, function (err, nRemoved, unknown) {
        if (err) { defer.reject(err) }
        else { defer.resolve() }
    });
    return defer.promise;
}

function Upcoming_get(id) {
    return Q.Promise(function (resolve, reject, notify) {
        var query = models.UpcomingClass.find({ _id: id });
        query.populate('category');
        query.exec(function (err, upcomingClasses) {
            err ? reject(err) : resolve(upcomingClasses[0]);
        });
    });
}

function Upcoming_getAll() {
    return Q.Promise(function (resolve, reject, notify) {
        var query = models.UpcomingClass.find({});
        query.populate('category');
        query.exec(function (err, upcomingClasses) {
            err ? reject(err) : resolve(upcomingClasses); 
        });
    });
}

function upsertUpcomingClasses(upcomingClass) {
    var defer = Q.defer();

    var classFound;
    getUpcomingClasses({ eventId: upcomingClass.eventId })
    .then(
        function (c) {
            classFound = c
        },
        function (err) {
            defer.reject()
        }
            , function(oldClass) {
        if (IsEmptyNullUndefined(oldClass)) {
            createUpcomingClass(upcomingClass);
        }
        else {
            upcomingClass._id = oldClass[0]._id;
            updateUpcomingClass(upcomingClass);
        }
        defer.resolve()
    });
    return defer.promise;
}

function addCategoriesToEvents(events) {
    
    
    var defer = Q.defer();

    var eventIds = _.pluck(events, 'eventId');

    models.UpcomingClass.find({ eventId: { $in: eventIds }}, function(err, upcomingClasses) {
        
        
        var eventsWithCategory =  _.map(events, function (e) {
            
            
            var matchingClass = _.findWhere(upcomingClasses, { eventId: e.eventId});
            e.category = matchingClass ? matchingClass.category : 'Unknown';
            return e;
        });

        defer.resolve(eventsWithCategory);
    });

    return defer.promise;
}

function Requested_add(requested) {
    var defer = Q.defer();
    var r = new models.RequestedClass(requested);
    r.save(function(err, r, numberAffected) {
        console.log('db.Requested_add ', JSON.stringify(r));
        if (err) { defer.reject(err) }
        else { defer.resolve(r) }
    });
    return defer.promise;
}

function getRequestedClass(id) {
    var defer = Q.defer();
    var query = models.RequestedClass.find({ _id: id});
    query.populate('requester', 'name thumbLink');
    query.populate('interestedUsers', 'name thumbLink');
    query.exec(function (err, requestClasses) {
        if (!err) {
            defer.resolve(requestClasses[0]);
        } else {
            defer.reject(err);
        }
    });
    return defer.promise;
}

function getRequestedClasses(id) {
    var defer = Q.defer();
    var query = id ? { _id: id } : {};
    models.RequestedClass.find(query, function(err, requestedClasses) {
        if (err) { defer.reject(err) }
        else { defer.resolve(requestedClasses) }
    });
    return defer.promise;
}

function Requested_get(id) {
    var defer = Q.defer();
    var query = models.RequestedClass.find({ _id: id});
    query.populate('requester', 'name thumbLink');
    query.populate('interestedUsers', 'name thumbLink');
    query.exec(function (err, requestClasses) {
        if (!err) {
            defer.resolve(requestClasses[0]);
        } else {
            defer.reject(err);
        }
    });
    return defer.promise;
}

function Requested_getAll() {
    return Q.Promise(function (resolve, reject, notify) {
        var query = models.RequestedClass.find({});
        query.populate('category');
        query.exec(function (err, requestedClasses) {
            err ? reject(err) : resolve(requestedClasses);
        });
    });
}


function Requested_remove(query) {
    var defer = Q.defer();
    models.RequestedClass.remove(query, function (err, b, c) {
        console.log('db.Requested.remove: ', err, '| ', b, '| ', c);
        if (!err) {
            defer.resolve();
        } else {
            defer.reject("Unable to remove Requested Class, query: ", JSON.stringify(query));
        }
    });
    return defer.promise;
}

function Requested_setUserInterested(requestedClassId, userId, interested) {
    var defer = Q.defer();
    var findRequested = models.RequestedClass.findOne({ _id: requestedClassId }).exec();
    findRequested.then(function (requestedClass,a,b,c) {
        
        if (interested) {
            addUserToInterested(requestedClass);
        } else {
            removeUserFromInterested(requestedClass);
        }
        requestedClass.save(function (err, savedRequested) {
            if (!err) {
                thisModule.Requested.get(requestedClass._id).then(defer.resolve, defer.reject);
            } else {
                defer.reject('Unable to set user interested, err: ' + JSON.stringify(err));
            }
        });

    }, function (err) {
        console.err('Requested_setUserInterested err: ', err);
        defer.reject(err);
    });

    function addUserToInterested(requestedClass) {
        if (requestedClass.interestedUsers.indexOf(userId) === -1) {
            requestedClass.interestedUsers.push(userId);
        }
    }
    
    function removeUserFromInterested(requestedClass) {
        var existingUserIndex = requestedClass.interestedUsers.indexOf(userId);
        if (existingUserIndex !== -1) {
            requestedClass.interestedUsers.splice(existingUserIndex, 1);
        }
    }
    return defer.promise;
}

function getUser(query) {
	var defer = Q.defer();
	models.User.findOne(query, function(err, user) {
		if (err) { defer.reject(user) }
		else { defer.resolve(user) }
	});
	return defer.promise;
}

function upsertUser(query, user) {
    var defer = Q.defer();
    models.User.findOne(query, function (err, foundUser) {
        if (foundUser) {
            updateUser(query, user).then(defer.resolve, defer.reject);
        } else {
            addUser(user).then(defer.resolve, defer.reject);
        }
    });
	return defer.promise;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Private Functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function insertUpcomingClass(upcomingClass) {
    var defer = Q.defer();
    var u = new models.UpcomingClass(upcomingClass);
    u.save(function(err, u, numberAffected) {
        console.log('db insertUpcomingClass ', JSON.stringify(u));
        if (err) { defer.reject(err) }
        else { defer.resolve(u) }
    });
    return defer.promise;
}

function updateUpcomingClass(upcomingClass) {
    var defer = Q.defer();
    models.UpcomingClass.update({ _id: upcomingClass._id }, upcomingClass, {}, function(err, numberAffected) {
        console.log('db updateUpcomingClass ', upcomingClass);
        if (err) { defer.reject(err) }
        else { defer.resolve(upcomingClass) }
    });
    return defer.promise;
}

function addUser(user) {
    var defer = Q.defer();
    var u = new models.User(user);
    u.save(function(err, u, numberAffected) {
        console.log('db.adduser ', JSON.stringify(u));
        if (err) { defer.reject(err) }
        else { defer.resolve(u) }
    });
    return defer.promise;
}

function updateUser(query, user) {
    var defer = Q.defer();
    models.User.update(query, { $set: user }, function (err, numberAffected) {
        console.log('db.updateuser |',err,'|',numberAffected);
        if (err) {
            defer.reject(err);
        } else {
            getUser(query).then(defer.resolve, defer.reject);
        }
    });
    return defer.promise;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//for local development
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function insertFakeEvents(fakeEvents) {
    for (var i = 0; i < fakeEvents.length; i++) {
        var newEvent = new models.FakeEvent(fakeEvents[i]);
        newEvent.save(function (err, fakeEvent, numberAffected) {
            if (err) {
                //TODO: handle errors
                return;
            }
        });
    }
}

function getFakeEvents(callback) {
    models.FakeEvent.find({}, function(err, events) {
        callback(events);
    });
}

function addFakeEvent(fakeEvent) {
    var defer = Q.defer();

    if (!isValidFakeEvent(fakeEvent)) {
        defer.reject('Invalid fakeEvent');
    }

    var fe = new models.FakeEvent(fakeEvent);
    fe.save(function (err, savedEvent, numberAffected) {
        if (err) {
            defer.reject('Can not save fakeEvent');
        } else {
            defer.resolve(savedEvent);
        }
    });

    return defer.promise;
}

function isValidFakeEvent(fakeEvent) {
//    if (typeof fakeEvent.visibility !== 'string') return false;
//    if (typeof fakeEvent.status !== 'string') return false;
//    if (typeof fakeEvent.maybe_rsvp_count !== 'number') return false;
//    if (typeof fakeEvent.utc_offset !== 'number') return false;
//    if (typeof fakeEvent.id !== 'string') return false;
//    console.log('typeof fakeevent.time ', fakeEvent.time );
//    if (typeof fakeEvent.time !== 'number') return false;
//    if (typeof fakeEvent.announced !== 'boolean') return false;
//    if (typeof fakeEvent.waitlist_count !== 'number') return false;
//    if (typeof fakeEvent.created !== 'object') return false;
//    if (typeof fakeEvent.yes_rsvp_count !== 'number') return false;
//    if (typeof fakeEvent.updated !== 'object') return false;
//    if (typeof fakeEvent.event_url !== 'string') return false;
//    if (typeof fakeEvent.headcount !== 'number') return false;
    if (typeof fakeEvent.name !== 'string') return false;
//    if (typeof fakeEvent.group !== 'object') return false;
//    if (typeof fakeEvent.group.id !== 'number') return false;
//    if (typeof fakeEvent.group !== 'object') return false;
//    if (typeof fakeEvent.group !== 'object') return false;
//    if (typeof fakeEvent.group !== 'object') return false;
//    if (typeof fakeEvent.group !== 'object') return false;
//    if (typeof fakeEvent.group !== 'object') return false;
//    if (typeof fakeEvent.group !== 'object') return false;
//    if (typeof fakeEvent.group !== 'object') return false;
//    if (typeof fakeEvent.group !== 'object') return false;
//    visibility: String,
//        status: String,
//        maybe_rsvp_count: Number,
//        utc_offset: Number,
//        id: String,
//        time: Date,
//        announced: Boolean,
//        waitlist_count: Number,
//        created: Date,
//        yes_rsvp_count: Number,
//        updated: Date,
//        event_url: String,
//        headcount: Number,
//        name: String,
//        group: {
//        id: Number,
//            created: Date,
//            group_lat: Number,
//            name: String,
//            group_lon: Number,
//            join_mode: String,
//            urlname: String,
//            who: String
//    }
    return true;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
