//mongoose nhập khẩu

var _ = require('underscore');
var Q = require('q');
var mongoose = require('mongoose');
var models = require('./models.js')(mongoose);

//mongoose.set('debug', true);

mongoose.connect('mongodb://locallearnersqa:thirstyscholar1@ds043200.mongolab.com:43200/locallearnersqa');

var db = mongoose.connection;

db.once('open', function() {
    console.log('Connected to mongolab, database ready.');
});

module.exports.getCategories = function (callback) {
    models.Category.find({}, function(err, data) {
        callback(data);
    });
}

module.exports.insertCategories = function (categories) {
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



module.exports.getUpcomingClasses = getUpcomingClasses;
function getUpcomingClasses(filter, callback) {
    if (!filter) {
        models.UpcomingClass.find({}, function(err, data) {
            callback(data);
        });
    }
    else if (filter.eventId) {
        models.UpcomingClass.find({ eventId: filter.eventId }, function(err, data) {
            callback(data);
        });
    }
}

module.exports.setUpcomingClasses = function(upcomingClass) {
    getUpcomingClasses({ eventId: upcomingClass.eventId }, function(oldClass) {
        if (IsEmptyNullUndefined(oldClass)) {
            createUpcomingClass(upcomingClass);
        }
        else {
            upcomingClass._id = oldClass[0]._id;
            updateUpcomingClass(upcomingClass);
        }
    });
}

module.exports.addCategoriesToEvents = function (events) {
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

function createUpcomingClass(upcomingClass) {
    var u = new models.UpcomingClass(upcomingClass);
    u.save(function(err, u, numberAffected) {
//        console.log('db createUpcomingClass ', JSON.stringify(u), ' 4444 ', JSON.stringify(upcomingClass));
        //TODO: handle errors
    });
}

function updateUpcomingClass(upcomingClass) {
    models.UpcomingClass.update({ _id: upcomingClass._id }, upcomingClass, {}, function(err, numberAffected) {
//        console.log('udapte', err, 'number ', numberAffected);
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//for local development
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.insertFakeEvents = function (fakeEvents) {
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
module.exports.getFakeEvents = function (callback) {
    models.FakeEvent.find({}, function(err, events) {
        callback(events);
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
