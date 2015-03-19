localLearnersApp.factory('UserProfile', function(EVENTS) {
    
    return {
        create: create,
        destroy: destroy
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Public Functions
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function create(profile) {
        this.meetupId = profile.meetupId;
        this.name = profile.name;
        this.thumbLink = profile.thumbLink;
    }
    function destroy() {
        this.meetupId = null;
        this.name = null;
        this.thumb_link = null;
    }
    
});