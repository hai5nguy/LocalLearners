localLearnersApp.factory('UserProfile', function() {
    return {
        create: function (profile) {
            this.mid = profile.mid;
            this.thumb_link = profile.thumb_link;
        },
        destroy: function () {
            this.mid = null;
            this.thumb_link = null;
        }
    }
});