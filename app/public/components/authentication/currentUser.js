localLearnersApp.factory('CurrentUser', function() {
    
    return {
        create: create,
        destroy: destroy
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Public Functions
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function create(profile) {
        this._id = profile._id;
        this.meetupId = profile.meetupId;
        this.name = profile.name;
        this.thumbLink = profile.thumbLink;
    }
    function destroy() {
        this._id = null;
        this.meetupId = null;
        this.name = null;
        this.thumb_link = null;
    }
    
});