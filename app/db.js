//mongoose nhập khẩu

var _ = require('underscore');
var Q = require('q');
var mongoose = require('mongoose');
var models = require('./models.js')(mongoose);

mongoose.connect('mongodb://locallearnersqa:thirstyscholar1@ds043200.mongolab.com:43200/locallearnersqa');

var db = mongoose.connection;

db.once('open', function() {
    console.log('Connected to mongolab, database ready.');
});

module.exports.getCategories = function (callback) {
    models.Category.find({}, function(err, data) {
        callback(_.pluck(data, 'name'));
    });
}

module.exports.insertCategories = function (categories) {
    for (var i = 0; i < categories.length; i++) {
        var newCategory = new models.Category({ name: categories[i] });
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

//    console.log('eventids ', eventIds);



//    for (var i = 0; i < events.length; i++) {
//        events[i].category = 'Unknown';
//        createUpcomingClass(events[i]);
//
//    }
//
//    models.UpcomingClass.find( { } , function (err, upcomingClasses) {ru
//        for (var i = 0; i < upcomingClasses.length; i++ ) {
//            upcomingClasses[i].category = 'Unknown2';
//            updateUpcomingClass(upcomingClasses[i]);
//        }
//    });
//
    models.UpcomingClass.find({ eventId: { $in: eventIds }}, function(err, upcomingClasses) {
        var eventsWithCategory =  _.map(events, function (e) {
            var matchingClass = _.findWhere(upcomingClasses, { eventId: e.eventId});

            e.category = matchingClass ? matchingClass.category : 'Unknown';
            return e;
        });

//        console.log('events with category ', eventsWithCategory);

        defer.resolve(eventsWithCategory);

    });
//
//    var eventIds = [];
//    for (var i = 0; i < events.length; i++) {
//        eventIds.push(events[i].id)
//    }
//
//    for (var i = 0; i < events.length; i++) {
////        var e = events[i];
//
//        addCategoryToEvent(events[i]);

//        models.UpcomingClass.find({ eventId: events[i].eventId  }, function(upcomingClass, e) {
//
//
//
//
//            console.log('e ', e);
//            console.log('the fucken events ', events);
//            console.log('what the actual fuck ', events[i]);
//            if (upcomingClass) {
//                events[i].category = upcomingClass.category;
//            } else {
//                events[i].category = 'Unknown';
//            }
//        });

 //   }

//    function addCategoryToEvent(event) {
//        models.UpcomingClass.find({ eventId: event.eventId  }, function(upcomingClass) {
//
//            console.log('event ', event);
//            if (upcomingClass) {
//                event.category = upcomingClass.category;
//            } else {
//                event.category = 'Unknown';
//            }
//        });
//    }
//
//    console.log('acte 2 ', events);

    //defer.resolve(events);

    return defer.promise;
}

function createUpcomingClass(upcomingClass) {
    var u = new models.UpcomingClass(upcomingClass);
    u.save(function(err, u, numberAffected) {
        //TODO: handle errors
    });
}

function updateUpcomingClass(upcomingClass) {
    models.UpcomingClass.update({ _id: upcomingClass._id }, upcomingClass, {}, function(err, numberAffected) {
        console.log('udapte', err, 'number ', numberAffected);
    });
}
