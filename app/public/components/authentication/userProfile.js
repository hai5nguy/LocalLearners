localLearnerApp.factory('UserProfile', function() {
    return {
        create: function (profile) {
            this.userId = profile.userId;
            this.thumb_link = profile.thumb_link;
        },
        destroy: function () {
            this.userId = null;
            this.thumb_link = null;
        }
    }
});