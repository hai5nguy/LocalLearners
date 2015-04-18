var _ = require('../node_modules/underscore');
var prettyjson = require('../node_modules/prettyjson');

global.FUNCTIONALITY = {
    meetup_api_profile_get      : 'meetup_api_profile_get',
    meetup_api_Event_post       : 'meetup_api_Event_post',
    meetup_sync_show_events     : 'meetup_sync_show_events',
    meetup_sync_show_updates    : 'meetup_sync_show_updates',
    db_addUser                  : 'db_addUser',
    db_Requested_remove         : 'db_Requested_remove',
    db_Upcoming_add             : 'db_Upcoming_add',
    db_Upcoming_remove          : 'db_Upcoming_remove',
    db_Upcoming_update          : 'db_Upcoming_update',
    api_post_upcoming           : 'api_post_upcoming'
};

var tracks = {
    userAuthentication: {
        active: false,
        functionalities: [
            FUNCTIONALITY.meetup_api_profile_get,
            FUNCTIONALITY.db_addUser
        ]
    },
    postingUpcomingClass: {
        active: false,
        functionalities: [
            FUNCTIONALITY.api_post_upcoming,
            FUNCTIONALITY.meetup_api_Event_post,
            FUNCTIONALITY.db_Upcoming_add,
            FUNCTIONALITY.db_Requested_remove
        ]
    },
    meetupSyncHighVerbose: {
        active: false,
        functionalities: [
            FUNCTIONALITY.meetup_sync_show_events,
            FUNCTIONALITY.meetup_sync_show_updates,
            FUNCTIONALITY.db_Upcoming_remove,
            FUNCTIONALITY.db_Upcoming_update
        ]
    },
    meetupSyncLowVerbose: {
        active: false,
        functionalities: [
            FUNCTIONALITY.meetup_sync_show_updates,
            FUNCTIONALITY.db_Upcoming_remove,
            FUNCTIONALITY.db_Upcoming_update
        ]
    }
}

tracks.meetupSyncLowVerbose.active = true;
tracks.meetupSyncHighVerbose.active = false;

tracks.userAuthentication.active    = false;
tracks.postingUpcomingClass.active  = true;




global.debug = function(functionality) {
    if (isTrackingFunctionality(functionality)) {
        console.log('');
        console.log('=== ' + functionality + ' ===========================================================');
        var message = '';
        for (var i = 1; i < arguments.length; i++) {
            console.log(prettyjson.render(arguments[i]));
            //message += JSON.stringify(arguments[i]) + ' _____ ';
        }
        //console.log(message);
    }
}




function isTrackingFunctionality(functionality) {
    var activeTracks = _.where(tracks, { active: true });
    if (!activeTracks || !activeTracks.length) return false;
    for (var i = 0; i < activeTracks.length; i++) {
        if (activeTracks[i].functionalities.indexOf(functionality) >= 0) return true;
    }
    return false;
}
