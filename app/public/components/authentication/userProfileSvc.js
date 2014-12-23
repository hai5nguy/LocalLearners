localLearnerApp.factory('UserProfile', function() {
    return {
        create: function (sessionId, userId, meetupAccessToken) {
            this.id = sessionId;
            this.userId = userId;
            this.meetupAccessToken = meetupAccessToken;
        },
        destroy: function () {
            this.id = null;
            this.userId = null;
            this.meetupAccessToken = null;
        }
    }
});