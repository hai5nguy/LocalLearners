//mongoose nhập khẩu

require('./core.js');
var _ = require('underscore');
var Q = require('q');
var mongoose = require('mongoose');
var models = require('./models.js')(mongoose);

mongoose.connect('mongodb://locallearnersqa:thirstyscholar1@ds043200.mongolab.com:43200/locallearnersqa');

//var Category = models.Category;


var db = mongoose.connection;

db.once('open', function() {


    console.log('connected');

//
//    console.log('cat ', models.Category.find({}, function(err, data) {
//        console.log('data ', data);
//    }));

//    var blah = Category.find(function(err, data){
//        console.log('data ', data);
//    });
});

//models.Category.find({}, function(err, data) {
//    console.log('data ', data);
//});



module.exports.getCategories = function (filter, callback) {
    if (!filter) {
        models.Category.find({}, function(err, data) {
            callback(data);
        });
    }
//    else if (filter.id) {
//
//    }
    //return { id: '123', name: 'Technology' }
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

        console.log('oldclass', oldClass);
        if (IsEmptyNullUndefined(oldClass)) {

            console.log('yo');
            createUpcomingClass(upcomingClass);
        }
        else {
            upcomingClass._id = oldClass[0]._id;
            console.log('updating ', upcomingClass);
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
//    models.UpcomingClass.find( { } , function (err, upcomingClasses) {
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
