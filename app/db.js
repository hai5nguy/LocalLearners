var _ = require('underscore');
var Q = require('q');
var mongoose = require('mongoose');
var models = require('./db-models.js')(mongoose);
var db = mongoose.connection;

//mongoose.set('debug', true);
mongoose.connect('mongodb://locallearnersqa:thirstyscholar1@ds043200.mongolab.com:43200/locallearnersqa');
db.once('open', function() {
    console.log('Connected to mongolab, database ready.');
});

module.exports = function(app) {

    return {
        getCategories: getCategories,
        getCategory: getCategory,
        insertCategories: insertCategories,
        addUpcomingClass: addUpcomingClass,
        removeUpcomingClasses: removeUpcomingClasses,
        getUpcomingClasses: getUpcomingClasses,
        upsertUpcomingClasses: upsertUpcomingClasses,
        addCategoriesToEvents: addCategoriesToEvents,
        addRequestedClass: addRequestedClass,
        getRequestedClasses: getRequestedClasses,
		getUser: getUser,
		addUser: addUser,
		findAndModifyUser: findAndModifyUser,

        //for development
        insertFakeEvents: insertFakeEvents,
        getFakeEvents: getFakeEvents,
        addFakeEvent: addFakeEvent
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Public Functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getCategories(callback) {
    var defer = Q.defer();
    models.Category.find({}, function(err, categories) {
        if (err) { defer.reject(err) }
        else { defer.resolve(categories) }
    });
    return defer.promise;
}

function getCategory(query) {
    var defer = Q.defer();
    models.Category.find(query, function (err, data) {
        if (err) {
            defer.reject(err);
        } else {
            var firstCategory = {
                name: data[0].name,
                value: data[0].value,
                imageUrl: data[0].imageUrl
            }
//            console.log('category ', firstCategory);
            defer.resolve(firstCategory);
        }
    });
    return defer.promise;
}

function insertCategories(categories) {
    for (var i = 0; i < categories.length; i++) {
        var newCategory = new models.Category(categories[i]);
        newCategory.save(function (err, category, numberAffected) {
            if (err) {
                //TODO: handle errors
                return;
            }
        });
    }
}

function addUpcomingClass(upcomingClass) {
    var defer = Q.defer();
    var u = new models.UpcomingClass(upcomingClass);
    u.save(function(err, u, numberAffected) {
//        console.log('db.addUpcomingClass ', JSON.stringify(u));
        if (err) { defer.reject(err) }
        else { defer.resolve(u) }
    });
    return defer.promise;
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

function getUpcomingClasses(filter) {
    var defer = Q.defer();
    var q = (filter && filter.eventId) ? { eventId: filter.eventId } : {};
    models.UpcomingClass.find(q, function(err, upcomingClasses) {
        if (err) { defer.reject(err) }
        else { defer.resolve(upcomingClasses) }
    });
    return defer.promise;
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

function addRequestedClass(requested) {
    var defer = Q.defer();
    var r = new models.RequestedClass(requested);
    r.save(function(err, r, numberAffected) {
        console.log('db.addRequestedClass ', JSON.stringify(r));
        if (err) { defer.reject(err) }
        else { defer.resolve(r) }
    });
    return defer.promise;
}

function getRequestedClasses() {
    var defer = Q.defer();
//    var q = (filter && filter.eventId) ? { eventId: filter.eventId } : {};
    models.RequestedClass.find({}, function(err, requestedClasses) {
        if (err) { defer.reject(err) }
        else { defer.resolve(requestedClasses) }
    });
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

function findAndModifyUser(query, updatedUser) {
	var defer = Q.defer();
	models.User.findOneAndUpdate(query, updatedUser, {
		new: true,
		upsert: true
	}, function (err, user) {
        //console.log('db.findandmodifyuser: ', JSON.stringify(err), ' ', JSON.stringify(user));
        defer.resolve({ err: err, user: user});
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
