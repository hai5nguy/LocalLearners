var _ = require('underscore');
var Q = require('q');


var meetupApi = require('./meetup-api.js')(THE_APP);
var db = require('./db.js')(THE_APP);

module.exports = function (app) {
    startSync();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Private Functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function startSync() {
    setInterval(doSync, MEETUP_SYNC_INTERVAL_IN_MILLISECONDS);
}
function doSync() {
    
    db.Upcoming.getAll().then(function (upcomingClasses) {
        
        meetupApi.Event.getAll().then(function (events) {
                updateUpcomingClassesWithEvents(upcomingClasses, events);
        }, function (error) {
                syncError(error);
        });
        
    }, function (error) {
        syncError(error);
    });
    
}

function syncError(error) {
    console.log('meetup sync error: ', JSON.stringify(error));
}

function updateUpcomingClassesWithEvents(upcomingClasses, events) {
    _.each(upcomingClasses, function (u) {
        var matchingEvent = _.findWhere(events, { id: u.meetupEvent.id });
        if (!matchingEvent) {
            console.error('meetup sync possible class cancel on meetup.com detected: ', JSON.stringify(u));
            return;
        }
        if (!_.isEqual(matchingEvent, u.meetupEvent)) {
            u.meetupEvent = matchingEvent;
            db.Upcoming.update({ _id: u._id }, u);
        }
    });
}