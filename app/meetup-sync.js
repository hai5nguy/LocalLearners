var _ = require('underscore');

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
    
    //todo: redo sync with promises
    
    //meetupApi.Event.getAll().then(function(events) {
    //
    //    db.getUpcomingClasses().then(function(upcommingClasses) {
    //
    //        var classesNotOnMeetup = _.filter(upcommingClasses, function (u) {
    //            return !_.some(events, function (e) {
    //                return e.eventId === u.eventId;
    //            });
    //        });
    //
    //        db.removeUpcomingClasses(classesNotOnMeetup).fail(syncError);
    //
    //    }, syncError );
    //
    //}, syncError );
    //
    //function syncError(err) {
    //    console.log('meetup sync error: ', err);
    //}
}