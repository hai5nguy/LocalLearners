var _ = require('underscore');
var Q = require('q');


var MeetupApi   = require(LL_MODULES_DIR + 'MeetupApi.js');
var Database    = require(LL_MODULES_DIR + 'Database.js');

module.exports = function () {
    startSync();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Private Functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function startSync() {
    //setInterval(doSync, MEETUP_SYNC_INTERVAL_IN_MILLISECONDS);
}
function doSync() {
    
    /*
    
    db.Upcoming.getAll().then(function (upcomingClasses) {
        //debug(FUNCTIONALITY.meetup_sync, 'doSync','upcomingClasses', upcomingClasses );
        meetupApi.Event.getAll().then(function (events) {
            debug(FUNCTIONALITY.meetup_sync_show_events, 'doSync','events', events );
            updateUpcomingClassesWithEvents(upcomingClasses, events);
        }, function (error) {
                syncError(error);
        });
        
    }, function (error) {
        syncError(error);
    });
    
    */
    
    
    
    Q.fcall(getAllUpcomingClasses())
        .then(syncEvents())
        //.then(syncRSVPs())
        .catch(function (error) {
            debug(FUNCTIONALITY.meetup_sync, 'doSync', { error: error });
        })
        .done();
}

/////////////////////////////////////////////////////////////////////////////////////

function getAllUpcomingClasses() {
    return function () {
        return Q.Promise(function (resolve, reject, notify) {
            db.Upcoming.getAll().then(resolve, reject);
        });
    }
}

function syncEvents() {
    return function () {
        return Q.Promise(function (resolve, reject, notify) {
            db.Upcoming.getAll().then(function (upcomingClasses) {
                meetupApi.Event.getAll().then(function (events) {
                    var eventUpdatingPromises = generateEventUpdatingPromises(upcomingClasses, events);
                    Q.all(eventUpdatingPromises).then(resolve, reject);
                }, reject);
            }, reject);
        });
    };

    function generateEventUpdatingPromises(upcomingClasses, events) {
        var promises = [];

        for (var i = 0; i < upcomingClasses.length; i++) {
            promises.push(Q.Promise(function (resolve, reject, notify) {

                var upcomingClass = upcomingClasses[i];
                var matchingEvent = _.findWhere(events, { id: upcomingClass.meetupEvent.id });
                if (!matchingEvent) {
                    debug(FUNCTIONALITY.meetup_sync_show_event_updates, 'syncEvents','meetup sync possible class cancel on meetup.com detected', { upcomingClass: upcomingClass.toObject() });
                    db.Upcoming.remove({ _id: upcomingClass._id }).then(resolve, reject);
                }
                if (_.isEqual(matchingEvent, upcomingClass.meetupEvent)) {
                    //debug(FUNCTIONALITY.meetup_sync_show_event_updates, 'syncEvents','sync NOT needed', { upcomingClass: upcomingClass.toObject(), matchingEvent: matchingEvent });
                    resolve();
                } else {
                    debug(FUNCTIONALITY.meetup_sync_show_event_updates, 'syncEvents','sync needed', { upcomingClass: upcomingClass.toObject(), matchingEvent: matchingEvent });
                    upcomingClass.meetupEvent = matchingEvent;
                    db.Upcoming.update({ _id: upcomingClass._id }, upcomingClass).then(resolve, reject);
                }

            }));
        }

        return promises;
    }
    
}

//
//function syncRSVPs() {
//    return function () {
//        return Q.Promise(function (resolve, reject, notify) {
//            db.Upcoming.getAll().then(function (upcomingClasses) {
//                meetupApi.RSVP.getAll().then(function (listOfRSVPs) {
//                    
//                }, reject);
//            }, reject);
//        });
//    }
//}
/*

function updateUpcomingClassesWithEvents(upcomingClasses, events) {
    _.each(upcomingClasses, function (u) {
        var matchingEvent = _.findWhere(events, { id: u.meetupEvent.id });
        if (!matchingEvent) {
            debug(FUNCTIONALITY.meetup_sync_show_updates, 'updateUpcomingClassesWithEvents','meetup sync possible class cancel on meetup.com detected', 'upcomingClass', typeof u, {u: u.toObject() } );
            db.Upcoming.remove({ _id: u._id });
            return;
        }
        if (!_.isEqual(matchingEvent, u.meetupEvent)) {
            debug(FUNCTIONALITY.meetup_sync_show_updates, 'updateUpcomingClassesWithEvents','sync needed', 'upcomingclass', u, 'matchingEvent', matchingEvent);
            u.meetupEvent = matchingEvent;
            db.Upcoming.update({ _id: u._id }, u);
            
        }
    });
};
    
    */