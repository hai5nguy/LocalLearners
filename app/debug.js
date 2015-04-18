var _ = require('../node_modules/underscore');

global.FUNCTIONALITY = {
    meetup_api_profile_get  : 'meetup_api_profile_get',
    meetup_api_Event_post   : 'meetup_api_Event_post',
    meetup_sync             : 'meetup_sync',
    db_addUser              : 'db_addUser',
    db_Upcoming_add         : 'db_Upcoming_add',
    db_Upcoming_remove      : 'db_Upcoming_remove',
    db_Upcoming_update      : 'db_Upcoming_update',
    api_post_upcoming       : 'api_post_upcoming'
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
            FUNCTIONALITY.db_Upcoming_add
        ]
    },
    meetupSync: {
        active: true,  //always true for long term debugging -hmn
        functionalities: [
            FUNCTIONALITY.meetup_sync,
            FUNCTIONALITY.db_Upcoming_remove,
            FUNCTIONALITY.db_Upcoming_update
        ]
    }
}

tracks.userAuthentication.active    = false;
tracks.postingUpcomingClass.active  = true;




global.debug = function(functionality) {
    if (isTrackingFunctionality(functionality)) {
        console.log('========================================================================================================');
        var message = functionality;
        for (var i = 1; i < arguments.length; i++) {
            message += ' ______ ' + JSON.stringify(arguments[i]);
            //message += ' ______ ' + arguments[i];
        }
        console.log(message);
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
