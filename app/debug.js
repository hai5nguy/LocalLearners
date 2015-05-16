var _ = require('../node_modules/underscore');
var prettyjson = require('../node_modules/prettyjson');

global.FUNCTIONALITY = {
    Authentication_deserializeUser      : 'Authentication_deserializeUser',
    Authentication_ensureAuthenticated  : 'Authentication_ensureAuthenticated',
    api_get_upcoming_by_id              : 'api_get_upcoming_by_id',
    api_post_upcoming                   : 'api_post_upcoming',
    Database_User_update                : 'Database_User_update',
    Database_User_upsert                : 'Database_User_upsert',
    fakemeetupapi                       : 'fakemeetupapi',
    meetup_api_profile_get              : 'meetup_api_profile_get',
    meetup_api_Event_get                : 'meetup_api_Event_get',
    MeetupApi_Event_post                : 'MeetupApi_Event_post',
    meetup_api_RSVP_get                 : 'meetup_api_RSVP_get',
    meetup_sync                         : 'meetup_sync',
    meetup_sync_show_events             : 'meetup_sync_show_events',
    meetup_sync_show_event_updates      : 'meetup_sync_show_event_updates',
    Database_User_add                   : 'Database_User_add',
    db_Requested_remove                 : 'db_Requested_remove',
    db_Upcoming_add                     : 'db_Upcoming_add',
    Database_Upcoming_allocateNew       : 'Database_Upcoming_allocateNew',
    db_Upcoming_remove                  : 'db_Upcoming_remove',
    db_Upcoming_update                  : 'db_Upcoming_update',
    UpcomingClass_initialize            : 'UpcomingClass_initialize'
};

var tracks = {
    getUpcomingClassById: {
        active: false,
        functionalities: [
            FUNCTIONALITY.api_get_upcoming_by_id,
            FUNCTIONALITY.meetup_api_Event_get,
            FUNCTIONALITY.meetup_api_RSVP_get
        ]
    },
    userAuthentication: {
        active: false,
        functionalities: [
            FUNCTIONALITY.meetup_api_profile_get,
            FUNCTIONALITY.Database_User_add,
            FUNCTIONALITY.Database_User_update,
            FUNCTIONALITY.Database_User_upsert
        ]
    },
    postingUpcomingClass: {
        active: false,
        functionalities: [
            FUNCTIONALITY.api_post_upcoming,
            FUNCTIONALITY.MeetupApi_Event_post,
            FUNCTIONALITY.db_Upcoming_add,
            FUNCTIONALITY.db_Requested_remove,
            FUNCTIONALITY.fakemeetupapi,
            FUNCTIONALITY.Database_Upcoming_allocateNew
        ]
    },
    meetupSyncHighVerbose: {
        active: false,
        functionalities: [
            FUNCTIONALITY.meetup_sync_show_events,
            FUNCTIONALITY.meetup_sync_show_event_updates,
            FUNCTIONALITY.db_Upcoming_remove,
            FUNCTIONALITY.db_Upcoming_update
        ]
    },
    meetupSyncLowVerbose: {
        active: true,
        functionalities: [
            FUNCTIONALITY.meetup_sync_show_event_updates,
            FUNCTIONALITY.db_Upcoming_remove,
            FUNCTIONALITY.db_Upcoming_update
        ]
    }
}

//tracks.meetupSyncLowVerbose.active = true;
//tracks.meetupSyncHighVerbose.active = false;
//
//tracks.userAuthentication.active    = false;
//
//tracks.postingUpcomingClass.active  = true;
//tracks.getUpcomingClassById.active  = true;




global.debug = function(functionality) {
    if (functionality === true || isTrackingFunctionality(functionality)) {
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
